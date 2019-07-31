import { NavigationActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName
    })
  );
}

function navigateWithParams (routeName, params) {
	_navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params
    })
  );
}

// add other navigation functions that you need and export them

export default {
  navigate,
  navigateWithParams,
  setTopLevelNavigator,
};