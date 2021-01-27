/**
 * AnalyticsDashboardWidgetSiteStats component.
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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	getTimeInSeconds,
} from '../../../../util';
import GoogleChart from '../../../../components/GoogleChart';
import withData from '../../../../components/higherorder/withData';
import { TYPE_MODULES } from '../../../../components/data';
import { extractAnalyticsDashboardData, siteAnalyticsReportDataDefaults } from '../../util';
import PreviewBlock from '../../../../components/PreviewBlock';

class AnalyticsDashboardWidgetSiteStats extends Component {
	constructor( props ) {
		super( props );

		this.setOptions = this.setOptions.bind( this );
	}

	setOptions() {
		const { series, vAxes } = this.props;

		const pageTitle = '' === global._googlesitekitLegacyData.pageTitle ? '' : __( 'Users Traffic Summary', 'google-site-kit' );

		const options = {
			chart: {
				title: pageTitle,
			},
			curveType: 'line',
			height: 270,
			width: '100%',
			chartArea: {
				height: '80%',
				width: '87%',
			},
			legend: {
				position: 'top',
				textStyle: {
					color: '#616161',
					fontSize: 12,
				},
			},
			hAxis: {
				format: 'M/d/yy',
				gridlines: {
					color: '#fff',
				},
				textStyle: {
					color: '#616161',
					fontSize: 12,
				},
			},
			vAxis: {
				gridlines: {
					color: '#eee',
				},
				minorGridlines: {
					color: '#eee',
				},
				textStyle: {
					color: '#616161',
					fontSize: 12,
				},
				titleTextStyle: {
					color: '#616161',
					fontSize: 12,
					italic: false,
				},
			},
			focusTarget: 'category',
			crosshair: {
				color: 'gray',
				opacity: 0.1,
				orientation: 'vertical',
				trigger: 'both',
			},
			tooltip: {
				isHtml: true, // eslint-disable-line sitekit/acronym-case
				trigger: 'both',
			},
		};

		options.series = series;
		options.vAxes = vAxes;

		return options;
	}

	render() {
		const { data, selectedStats, dateRangeSlug } = this.props;

		if ( ! data || ! data.length ) {
			return null;
		}

		const days = dateRangeSlug ? dateRangeSlug.match( /\d+/ ).map( Number )[ 0 ] : 28;
		const dataMap = extractAnalyticsDashboardData( data, selectedStats, days );

		if ( ! dataMap ) {
			return null;
		}

		const options = this.setOptions();

		return (
			<section className="googlesitekit-analytics-site-stats mdc-layout-grid">
				<div className="mdc-layout-grid__inner">
					<div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
						<GoogleChart
							chartType="line"
							selectedStats={ selectedStats }
							data={ dataMap }
							options={ options }
						/>
					</div>
				</div>
			</section>
		);
	}
}

export default withData(
	AnalyticsDashboardWidgetSiteStats,
	[
		{
			type: TYPE_MODULES,
			identifier: 'analytics',
			datapoint: 'report',
			data: siteAnalyticsReportDataDefaults,
			priority: 1,
			maxAge: getTimeInSeconds( 'day' ),
			context: 'Single',
		},
	],
	<PreviewBlock width="100%" height="270px" padding />,
	{ createGrid: true }
);
