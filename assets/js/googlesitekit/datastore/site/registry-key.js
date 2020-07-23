/**
 * File Contents Description.
 *
 * Site Kit by Google, Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import invariant from 'invariant';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { STORE_NAME } from './constants';

const { createRegistryControl } = Data;

// Actions
const SET_REGISTRY_KEY = 'SET_REGISTRY_KEY';
const WAIT_FOR_REGISTRY_KEY = 'WAIT_FOR_REGISTRY_KEY';

const INITIAL_STATE = {
	registryKey: undefined,
};

export const actions = {
	/**
	 * Wait for the registryKey to be resolved.
	 *
	 * @since n.e.x.t
	 *
	 * @return {Object} Redux-style action.
	 */
	waitForRegistryKey() {
		return {
			payload: {},
			type: WAIT_FOR_REGISTRY_KEY,
		};
	},
	/**
	 * Sets the registryKey in the data store.
	 *
	 * @since n.e.x.t
	 *
	 * @param {string} registryKey The registryKey for a given store.
	 * @return {Object} Redux-style action.
	 */
	setRegistryKey( registryKey ) {
		invariant( registryKey, 'registryKey is required.' );
		return {
			payload: { registryKey },
			type: SET_REGISTRY_KEY,
		};
	},
};

export const controls = {
	[ WAIT_FOR_REGISTRY_KEY ]: createRegistryControl( ( registry ) => ( { payload: {} } ) => {
		// Select first to ensure resolution is always triggered.
		const { getRegistryKey, hasFinishedResolution } = registry.select( STORE_NAME );
		getRegistryKey();
		const isRegistryKeyLoaded = () => hasFinishedResolution( 'getRegistryKey', [] );
		if ( isRegistryKeyLoaded() ) {
			return;
		}
		return new Promise( ( resolve ) => {
			const unsubscribe = registry.subscribe( () => {
				if ( isRegistryKeyLoaded() ) {
					unsubscribe();
					resolve();
				}
			} );
		} );
	} ),
};

export const reducer = ( state, { payload, type } ) => {
	switch ( type ) {
		case SET_REGISTRY_KEY: {
			const { registryKey } = payload;
			return {
				...state,
				registryKey,
			};
		}
		default: {
			return { ...state };
		}
	}
};

const resolvers = {
	*getRegistryKey() {
		const { select } = yield Data.commonActions.getRegistry();

		if ( ! select( STORE_NAME ).getRegistryKey() ) {
			yield actions.setRegistryKey( uuidv4() );
		}
	},
};

export const selectors = {
	/**
	 * Returns the registry key being used for a given store.
	 *
	 * @since n.e.x.t
	 * @private
	 *
	 * @param {Object} state Data store's state.
	 * @return {(string|undefined)} The registryKey for a given store. Returns `undefined` if the key has not yet been set.
	 */
	getRegistryKey( state ) {
		const { registryKey } = state;
		return registryKey;
	},
};

export default {
	INITIAL_STATE,
	actions,
	resolvers,
	reducer,
	selectors,
};
