import React from 'react';
import { AutoComplete } from 'primereact/autocomplete';
import fetch from '../../../config/service';
import PropTypes from 'prop-types';

export default class autoComplete extends React.Component {
    static propTypes = {
        onChange: PropTypes.func,
        meta: PropTypes.shape({
            touched: PropTypes.bool,
            error: PropTypes.string,
        })
    };
    constructor(props) {
        super(props);
        this.state = {
            isValidate: false,
            filteredSuggestions: [],
            errorMessage: ''
        };
        this.getAllSuggestions('', 'cont');

    }

    // to get all suggestions in autocomplete
    getAllSuggestions = (event, type) => {
        this.setState({
            isValidate: false,
            noData: false,
            errorMessage: ''
        });
        let filterCriteria = {
            limit: 30,
            page: 1,
            sortfield: "created",
            direction: "desc",
            criteria: []
        };
        if (this.props.searchApi == 'users') {
            filterCriteria['criteria'].push({
                "key": "status",
                "value": "Active",
                "type": "eq"
            });
        }
        if (event && event.query) {
            filterCriteria['criteria'].push({
                "key": this.props.searchField,
                "value": event.query,
                "type": "regexOr"
            });
        };

        if (this.props.groupType && this.props.filterFieldType == 'leaves') {
            filterCriteria['criteria'].push({
                key: 'group',
                value: this.props.groupType,
                type: "regexOr"
            });
        }
        let apiUrl = this.props.searchApi;
        let url = `${apiUrl}?searchFrom=autoComplete&filter=${JSON.stringify(filterCriteria)}`;
        return fetch('GET', url)
            .then((response) => {
                if (response) {
                    let dropdownData = [];


                    if (response[apiUrl] && response[apiUrl].length && response[apiUrl].length > 0) {
                        dropdownData = response[apiUrl];
                    }
                    if (dropdownData && dropdownData.length == 0) {
                        this.setState({
                            filteredSuggestions: [],
                            noData: true
                        });
                    } else {
                        this.setSuggestions(dropdownData);
                    }
                }
            }).catch((err) => {
                return err;
            });
    }
    // set filtered sugeestions, removing duplicates
    setSuggestions = async (dropdownData) => {
        if (this.props.input && this.props.input.value) {
            if (this.props.input.value.length > 0) {
                let values = this.props.input.value;
                if (Array.isArray(values)) {
                    values.forEach(element => {
                        let field = '_id';
                        dropdownData = dropdownData.filter((item) => item[field] !== element[field]);
                    });
                }
            }
        }
        await this.setState({
            filteredSuggestions: dropdownData
        });
    }

    // on selected value from suggestions
    onSelectRecord(e) {
        this.setState({
            noData: false,
            isValidate: false,
            errorMessage: ''
        });
        if (this.props.input) {
            const { name, onChange } = this.props.input;
            onChange(e.value);
            this.props.handleAutoCompleteData(e.value, name)
            if (e && e.value) {
                this.removeDuplicates(e.value, name);
            }
        }

    }

    // to remove duplicates
    removeDuplicates() {
        if (this.state.filteredSuggestions) {
            this.setSuggestions(this.state.filteredSuggestions);
        }
    }

    render() {
        const {
            placeholder, input, multiple
        } = this.props;
        const { touched, error } = this.props.meta;
        return (
            <div className="date-picker">
                <span className="p-fluid">

                    <AutoComplete style={{ background: 'white' }}
                        multiple={multiple}
                        value={(input && input.value) ? input.value : null}
                        suggestions={this.state.filteredSuggestions}
                        completeMethod={(e) => this.getAllSuggestions(e)}
                        size={20}
                        minLength={3}
                        placeholder={placeholder}
                        dropdown={true}
                        onChange={(e) => this.onSelectRecord(e)}
                        field={this.props.searchField}
                        disabled={this.props.disabled}
                    />
                </span>
                {touched && error && <span className="form__form-group-error">{error}</span>}
                {this.state.noData && <span className="form__form-group-error">{'no records found'}</span>}
                {this.state.isValidate ?
                    <span className="form__form-group-error">{this.state.errorMessage}</span>
                    : null}

            </div>
        )
    }
}