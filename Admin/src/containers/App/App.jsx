import React, { Component, Fragment } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
// eslint-disable-next-line import/no-extraneous-dependencies

import { hot } from 'react-hot-loader';
import 'bootstrap/dist/css/bootstrap.css';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import '../../scss/app.scss';

import Router from './Router';
import store from './store';
import { settings } from '../../redux/actions/settingsAction'
import fetchMethodRequest from '../../config/service'
import ScrollToTop from './ScrollToTop';
import { config as i18nextConfig } from '../../translations';

// import fontAwsome icons
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faUsers, faTachometerAlt, faStethoscope, faPaperPlane, faUserFriends,
  faPlus, faFile, faEdit, faTrashAlt, faThumbsUp, faShoppingCart, faComments, faFemale, faMale, faDownload,
  faMoneyBillAlt, faGlobeAsia, faUser, faDollarSign, faCertificate, faSyncAlt, faUpload, faBookOpen,
  faBan, faCheckCircle, faTimesCircle, faCalendar, faTable, faInfoCircle, faBars, faHandPaper, faChevronRight, faChevronLeft, faCog, faPrint, faGripHorizontal, faList
} from '@fortawesome/free-solid-svg-icons'

// fontawsome icons library
library.add(
  faTachometerAlt,
  faUsers,
  faStethoscope,
  faChevronRight, faChevronLeft,
  faPaperPlane,
  faUserFriends,
  faPlus,
  faFile,
  faEdit,
  faTrashAlt,
  faThumbsUp,
  faShoppingCart,
  faComments,
  faDownload,
  faMoneyBillAlt,
  faGlobeAsia,
  faUser,
  faDollarSign,
  faCertificate,
  faSyncAlt,
  faUpload,
  faBookOpen, faFemale, faMale,
  faBan, faCheckCircle, faTimesCircle, faCalendar, faTable, faInfoCircle, faBars,
  faHandPaper, faCog, faPrint, faGripHorizontal, faList
)
const languageConfig = {
  "interpolation": {
    "escapeValue": false
  },
  "lng": "en",
  "resources": {
    "en": {
      "common": {}
    },
    "fr": {
      "common": {}
    },
  }
}

i18next.init(i18nextConfig);

class App extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      loaded: false,
    };
  }

  componentDidMount() {
    window.addEventListener('load', async () => {
      await this.loadSettingsData()

      // store.dispatch( addArticle({ title: 'React Redux Tutorial for Beginners', id: 1 }) );
      this.setState({ loading: false });
      setTimeout(() => this.setState({ loaded: true }), 500);
    });
  }
  loadSettingsData = async () => {
    // let filterCriteria = {};
    // filterCriteria['criteria'] = [{ key: 'userObjId', value: userDetails['_id'], type: 'eq' }];
    fetchMethodRequest('GET', `settings`).then(async (response) => {
      if (response && response.respCode) {
        let settingsData = response.settings[0]
        await store.dispatch(settings(settingsData))
        if (settingsData && settingsData.languageResources) {
          let langKeys = Object.keys(settingsData.languageResources)
          localStorage.setItem('langKeys', JSON.stringify(langKeys));
          await this.setState({
            langResources: settingsData.languageResources
          })
          let lanConfig = languageConfig;
          let currentLang = localStorage.getItem('currentLang');
          currentLang = currentLang ? currentLang : 'en';

          lanConfig.lng = currentLang;
          lanConfig.resources = this.state.langResources;
          await i18next.init(lanConfig);
          this.setState({
            loading: false,
            loaded: true
          })
        }
      }
    })
  }
  render() {
    const { loaded, loading } = this.state;
    return (
      <Provider store={store}>
        <BrowserRouter basename="/">
          <I18nextProvider i18n={i18next}>
            <ScrollToTop>
              <Fragment>
                {/* {!loaded
                  && (
                    <div className={`load${loading ? '' : ' loaded'}`}>
                      <div className="load__icon-wrap">
                        <svg className="load__icon">
                          <path fill="#4ce1b6" d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
                        </svg>
                      </div>
                    </div>
                  )
                } */}
                <div>
                  <Router />
                </div>
              </Fragment>
            </ScrollToTop>
          </I18nextProvider>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default hot(module)(App);
