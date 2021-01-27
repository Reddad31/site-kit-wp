/**
 * Analytics Setup stories.
 *
 * Site Kit by Google, Copyright 2021 Google LLC
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
import { storiesOf } from '@storybook/react';

/**
 * Internal dependencies
 */
import ModuleSetup from '../assets/js/components/setup/ModuleSetup';
import * as fixtures from '../assets/js/modules/analytics/datastore/__fixtures__';
import { STORE_NAME, ACCOUNT_CREATE, PROFILE_CREATE, PROVISIONING_SCOPE } from '../assets/js/modules/analytics/datastore/constants';
import { CORE_SITE } from '../assets/js/googlesitekit/datastore/site/constants';
import { CORE_USER } from '../assets/js/googlesitekit/datastore/user/constants';
import {
	WithTestRegistry,
	createTestRegistry,
	provideModules,
	provideModuleRegistrations,
} from '../tests/js/utils';
import { generateGTMAnalyticsPropertyStory } from './utils/generate-gtm-analytics-property-story';

function Setup( props ) {
	return (
		<WithTestRegistry { ...props }>
			<ModuleSetup moduleSlug="analytics" />
		</WithTestRegistry>
	);
}

function usingGenerateGTMAnalyticsPropertyStory( args ) {
	return generateGTMAnalyticsPropertyStory( {
		...args,
		Component: Setup,
		setUp: ( registry ) => {
			global._googlesitekitLegacyData.setup.moduleToSetup = 'analytics';
			provideModuleRegistrations( registry );
		},
	} );
}

storiesOf( 'Analytics Module/Setup', module )
	.addDecorator( ( storyFn ) => {
		global._googlesitekitLegacyData.setup.moduleToSetup = 'analytics';
		const registry = createTestRegistry();
		provideModules( registry, [ {
			slug: 'analytics',
			active: true,
			connected: true,
		} ] );
		provideModuleRegistrations( registry );

		return storyFn( registry );
	} )
	.add( 'Loading', ( registry ) => {
		registry.dispatch( STORE_NAME ).receiveGetSettings( {} );
		registry.dispatch( STORE_NAME ).receiveGetExistingTag( null );

		return <Setup registry={ registry } />;
	} )
	.add( 'Start', ( registry ) => {
		const { accounts, properties, profiles } = fixtures.accountsPropertiesProfiles;
		registry.dispatch( STORE_NAME ).receiveGetSettings( {} );
		registry.dispatch( STORE_NAME ).receiveGetAccounts( accounts );
		// eslint-disable-next-line sitekit/acronym-case
		registry.dispatch( STORE_NAME ).receiveGetProperties( properties, { accountID: properties[ 0 ].accountId } );
		registry.dispatch( STORE_NAME ).receiveGetProfiles( profiles, {
			// eslint-disable-next-line sitekit/acronym-case
			accountID: properties[ 0 ].accountId,
			// eslint-disable-next-line sitekit/acronym-case
			propertyID: profiles[ 0 ].webPropertyId,
		} );
		registry.dispatch( STORE_NAME ).receiveGetExistingTag( null );

		return <Setup registry={ registry } />;
	} )
	.add( 'Start (with matched property)', ( registry ) => {
		const { accounts, properties, profiles, matchedProperty } = fixtures.accountsPropertiesProfiles;
		registry.dispatch( STORE_NAME ).receiveGetSettings( {} );
		registry.dispatch( STORE_NAME ).receiveGetAccounts( accounts );
		// eslint-disable-next-line sitekit/acronym-case
		registry.dispatch( STORE_NAME ).receiveGetProperties( properties, { accountID: properties[ 0 ].accountId } );
		registry.dispatch( STORE_NAME ).receiveGetProfiles( profiles, {
			// eslint-disable-next-line sitekit/acronym-case
			accountID: properties[ 0 ].accountId,
			// eslint-disable-next-line sitekit/acronym-case
			propertyID: profiles[ 0 ].webPropertyId,
		} );
		registry.dispatch( STORE_NAME ).receiveGetExistingTag( null );
		registry.dispatch( STORE_NAME ).receiveMatchedProperty( matchedProperty );

		return <Setup registry={ registry } />;
	} )
	.add( 'Create new view', ( registry ) => {
		const { accounts, properties, profiles } = fixtures.accountsPropertiesProfiles;
		// eslint-disable-next-line sitekit/acronym-case
		const { accountId, webPropertyId } = profiles[ 0 ];
		// eslint-disable-next-line sitekit/acronym-case
		const { internalWebPropertyId } = properties.find( ( property ) => webPropertyId === property.id );
		registry.dispatch( STORE_NAME ).receiveGetSettings( {} );
		registry.dispatch( STORE_NAME ).receiveGetAccounts( accounts );
		// eslint-disable-next-line sitekit/acronym-case
		registry.dispatch( STORE_NAME ).receiveGetProperties( properties, { accountID: accountId } );
		registry.dispatch( STORE_NAME ).receiveGetProfiles( profiles, {
			// eslint-disable-next-line sitekit/acronym-case
			accountID: accountId,
			// eslint-disable-next-line sitekit/acronym-case
			propertyID: webPropertyId,
		} );
		registry.dispatch( STORE_NAME ).receiveGetExistingTag( null );
		registry.dispatch( STORE_NAME ).setSettings( {
			// eslint-disable-next-line sitekit/acronym-case
			accountID: accountId,
			// eslint-disable-next-line sitekit/acronym-case
			propertyID: webPropertyId,
			// eslint-disable-next-line sitekit/acronym-case
			internalWebPropertyID: internalWebPropertyId,
			profileID: PROFILE_CREATE,
			anonymizeIP: true,
			useSnippet: true,
			trackingDisabled: [ 'loggedinUsers' ],
		} );

		return <Setup registry={ registry } />;
	} )
	.add( 'Create Account Legacy (no accounts)', ( registry ) => {
		registry.dispatch( STORE_NAME ).receiveGetSettings( {} );
		registry.dispatch( STORE_NAME ).receiveGetAccounts( [] );
		registry.dispatch( STORE_NAME ).receiveGetExistingTag( null );

		return <Setup registry={ registry } />;
	} )
	.add( 'Create Account Legacy (new account option)', ( registry ) => {
		const { accounts, properties, profiles } = fixtures.accountsPropertiesProfiles;
		registry.dispatch( STORE_NAME ).receiveGetExistingTag( null );
		registry.dispatch( STORE_NAME ).receiveGetAccounts( accounts );
		// eslint-disable-next-line sitekit/acronym-case
		registry.dispatch( STORE_NAME ).receiveGetProperties( properties, { accountID: properties[ 0 ].accountId } );
		registry.dispatch( STORE_NAME ).receiveGetProfiles( profiles, {
			// eslint-disable-next-line sitekit/acronym-case
			accountID: properties[ 0 ].accountId,
			// eslint-disable-next-line sitekit/acronym-case
			propertyID: profiles[ 0 ].webPropertyId,
		} );
		registry.dispatch( STORE_NAME ).receiveGetSettings( {
			accountID: ACCOUNT_CREATE,
		} );

		return <Setup registry={ registry } />;
	} )
	.add( 'Create Account (scope not granted)', ( registry ) => {
		const { accounts, properties, profiles } = fixtures.accountsPropertiesProfiles;
		registry.dispatch( CORE_SITE ).receiveSiteInfo( {
			usingProxy: true,
			referenceSiteURL: 'http://example.com',
			timezone: 'America/Detroit',
			siteName: 'My Site Name',
		} );
		registry.dispatch( CORE_USER ).receiveGetAuthentication( {
			authenticated: true,
			requiredScopes: [],
			grantedScopes: [],
		} );
		registry.dispatch( STORE_NAME ).receiveGetExistingTag( null );
		registry.dispatch( STORE_NAME ).receiveGetAccounts( accounts );
		// eslint-disable-next-line sitekit/acronym-case
		registry.dispatch( STORE_NAME ).receiveGetProperties( properties, { accountID: properties[ 0 ].accountId } );
		registry.dispatch( STORE_NAME ).receiveGetProfiles( profiles, {
			// eslint-disable-next-line sitekit/acronym-case
			accountID: properties[ 0 ].accountId,
			// eslint-disable-next-line sitekit/acronym-case
			propertyID: profiles[ 0 ].webPropertyId,
		} );
		registry.dispatch( STORE_NAME ).receiveGetSettings( {
			accountID: ACCOUNT_CREATE,
		} );

		return <Setup registry={ registry } />;
	} )
	.add( 'Create Account (scope granted)', ( registry ) => {
		const { accounts, properties, profiles } = fixtures.accountsPropertiesProfiles;
		registry.dispatch( CORE_SITE ).receiveSiteInfo( {
			usingProxy: true,
			referenceSiteURL: 'http://example.com',
			timezone: 'America/Detroit',
			siteName: 'My Site Name',
		} );
		registry.dispatch( CORE_USER ).receiveGetAuthentication( {
			authenticated: true,
			requiredScopes: [],
			grantedScopes: [ PROVISIONING_SCOPE ],
		} );
		registry.dispatch( STORE_NAME ).receiveGetExistingTag( null );
		registry.dispatch( STORE_NAME ).receiveGetAccounts( accounts );
		// eslint-disable-next-line sitekit/acronym-case
		registry.dispatch( STORE_NAME ).receiveGetProperties( properties, { accountID: properties[ 0 ].accountId } );
		registry.dispatch( STORE_NAME ).receiveGetProfiles( profiles, {
			// eslint-disable-next-line sitekit/acronym-case
			accountID: properties[ 0 ].accountId,
			// eslint-disable-next-line sitekit/acronym-case
			propertyID: profiles[ 0 ].webPropertyId,
		} );
		registry.dispatch( STORE_NAME ).receiveGetSettings( {
			accountID: ACCOUNT_CREATE,
		} );

		return <Setup registry={ registry } />;
	} )
	.add( 'Existing Tag w/ access', ( registry ) => {
		const { accounts, properties, profiles } = fixtures.accountsPropertiesProfiles;
		const existingTag = {
			// eslint-disable-next-line sitekit/acronym-case
			accountID: properties[ 0 ].accountId,
			propertyID: properties[ 0 ].id,
		};

		registry.dispatch( STORE_NAME ).receiveGetSettings( {} );
		registry.dispatch( STORE_NAME ).receiveGetAccounts( accounts );
		// eslint-disable-next-line sitekit/acronym-case
		registry.dispatch( STORE_NAME ).receiveGetProperties( properties, { accountID: properties[ 0 ].accountId } );
		registry.dispatch( STORE_NAME ).receiveGetProfiles( profiles, {
			// eslint-disable-next-line sitekit/acronym-case
			accountID: properties[ 0 ].accountId,
			// eslint-disable-next-line sitekit/acronym-case
			propertyID: profiles[ 0 ].webPropertyId,
		} );
		registry.dispatch( STORE_NAME ).receiveGetExistingTag( existingTag.propertyID );
		registry.dispatch( STORE_NAME ).receiveGetTagPermission( {
			accountID: existingTag.accountID,
			permission: true,
		}, { propertyID: existingTag.propertyID } );

		return <Setup registry={ registry } />;
	} )
	.add( 'Existing Tag w/o access', ( registry ) => {
		const existingTag = {
			accountID: '12345678',
			propertyID: 'UA-12345678-1',
		};
		const { accounts, properties, profiles } = fixtures.accountsPropertiesProfiles;
		registry.dispatch( STORE_NAME ).receiveGetSettings( {} );
		registry.dispatch( STORE_NAME ).receiveGetAccounts( accounts );
		// eslint-disable-next-line sitekit/acronym-case
		registry.dispatch( STORE_NAME ).receiveGetProperties( properties, { accountID: properties[ 0 ].accountId } );
		registry.dispatch( STORE_NAME ).receiveGetProfiles( profiles, {
			// eslint-disable-next-line sitekit/acronym-case
			accountID: properties[ 0 ].accountId,
			// eslint-disable-next-line sitekit/acronym-case
			propertyID: profiles[ 0 ].webPropertyId,
		} );
		registry.dispatch( STORE_NAME ).receiveGetExistingTag( existingTag.propertyID );
		registry.dispatch( STORE_NAME ).receiveGetTagPermission( {
			accountID: existingTag.accountID,
			permission: false,
		}, { propertyID: existingTag.propertyID } );

		return <Setup registry={ registry } />;
	} )
	.add( 'No Tag, GTM property w/ access', usingGenerateGTMAnalyticsPropertyStory( { useExistingTag: false, gtmPermission: true } ) )
	.add( 'No Tag, GTM property w/o access', usingGenerateGTMAnalyticsPropertyStory( { useExistingTag: false, gtmPermission: false } ) )
	.add( 'Existing Tag w/ access, GTM property w/ access', usingGenerateGTMAnalyticsPropertyStory( { useExistingTag: true, gtmPermission: true, gaPermission: true } ) )
	.add( 'Existing Tag w/ access, GTM property w/o access', usingGenerateGTMAnalyticsPropertyStory( { useExistingTag: true, gtmPermission: false, gaPermission: true } ) )
	.add( 'Existing Tag w/o access, GTM property w/ access', usingGenerateGTMAnalyticsPropertyStory( { useExistingTag: true, gtmPermission: true, gaPermission: false } ) )
	.add( 'Existing Tag w/o access, GTM property w/o access', usingGenerateGTMAnalyticsPropertyStory( { useExistingTag: true, gtmPermission: false, gaPermission: false } ) )
	.add( 'Nothing selected', ( registry ) => {
		const { accounts, properties, profiles } = fixtures.accountsPropertiesProfiles;
		registry.dispatch( STORE_NAME ).receiveGetSettings( {} );
		registry.dispatch( STORE_NAME ).receiveGetAccounts( accounts );
		// eslint-disable-next-line sitekit/acronym-case
		registry.dispatch( STORE_NAME ).receiveGetProperties( properties, { accountID: properties[ 0 ].accountId } );
		registry.dispatch( STORE_NAME ).receiveGetProfiles( profiles, {
			// eslint-disable-next-line sitekit/acronym-case
			accountID: properties[ 0 ].accountId,
			// eslint-disable-next-line sitekit/acronym-case
			propertyID: profiles[ 0 ].webPropertyId,
		} );

		return <Setup registry={ registry } />;
	} )
;
