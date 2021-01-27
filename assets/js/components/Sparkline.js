/**
 * Sparkline component.
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
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { withInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import GoogleChart from './GoogleChart';

function Sparkline( {
	data,
	change,
	// eslint-disable-next-line sitekit/acronym-case
	instanceId,
	invertChangeColor,
	loadSmall,
	loadCompressed,
	loadHeight,
	loadText,
} ) {
	if ( ! data ) {
		return 'loading...';
	}

	const positiveColor = ! invertChangeColor ? 'green' : 'red';
	const negativeColor = ! invertChangeColor ? 'red' : 'green';

	const chartOptions = {
		title: '',
		backgroundColor: 'transparent',
		curveType: 'line',
		width: '100%',
		height: '50',
		enableInteractivity: false,
		chartArea: {
			height: '100%',
			width: '100%',
		},
		legend: { position: 'none' },
		axisFontSize: 0,
		hAxis: {
			baselineColor: 'none',
			ticks: [],
		},
		vAxis: {
			baselineColor: 'none',
			ticks: [],
		},
		axes: [],
		colors: [
			0 <= ( parseFloat( change ) || 0 ) ? positiveColor : negativeColor,
		],
	};

	return (
		<div className="googlesitekit-analytics-sparkline-chart-wrap">
			<GoogleChart
				chartType="line"
				data={ data }
				options={ chartOptions }
				// eslint-disable-next-line sitekit/acronym-case
				id={ `googlesitekit-sparkline-${ instanceId }` }
				loadSmall={ loadSmall }
				loadCompressed={ loadCompressed }
				loadHeight={ loadHeight }
				loadText={ loadText }
			/>
		</div>
	);
}

Sparkline.propTypes = {
	// eslint-disable-next-line sitekit/acronym-case
	instanceId: PropTypes.number.isRequired,
	invertChangeColor: PropTypes.bool,
	loadSmall: PropTypes.bool,
	loadCompressed: PropTypes.bool,
	loadHeight: PropTypes.number,
	loadText: PropTypes.bool,
};

Sparkline.defaultProps = {
	invertChangeColor: false,
	loadSmall: true,
	loadCompressed: true,
	loadHeight: 46,
	loadText: false,
};

export default withInstanceId( Sparkline );
