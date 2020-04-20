import * as actionTypes from './constants';
import { fromJS } from 'immutable';

const defaultState = fromJS ({
  currentAlbum: {},
  enterLoading: false,
})