export const SETTINGS_DATA = 'SETTINGS_DATA';
// export const AUTHENTICATE_ERROR_AUTH = 'AUTHENTICATE_ERROR_AUTH';

export function settings( data ) {
  console.log('refresh data',data)
  return {
    type: SETTINGS_DATA,
    data,
  };
}
