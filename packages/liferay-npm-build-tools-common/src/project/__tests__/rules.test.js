/**
 * © 2017 Liferay, Inc. <https://liferay.com>
 *
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import Rules from '../rules';

describe('single rule', () => {
	it('test alone', () => {
		const requireReturn = () => undefined;
		const rules = new Rules({
			_npmbundlerrc: {
				rules: [
					{
						test: '\\.css$',
						use: 'a-loader',
					},
				],
			},
			require: () => requireReturn,
		});

		expect(rules.loadersForFile('/home/me/my-project/main.css')).toEqual([
			{
				loader: 'a-loader',
				options: {},
				resolvedModule: 'liferay-npm-bundler-loader-a-loader',
				exec: requireReturn,
			},
		]);
	});

	it('test and include', () => {
		const requireReturn = () => undefined;
		const rules = new Rules({
			_npmbundlerrc: {
				rules: [
					{
						test: '\\.css$',
						include: 'main',
						use: 'a-loader',
					},
				],
			},
			require: () => requireReturn,
		});

		expect(rules.loadersForFile('/home/me/my-project/main.css')).toEqual([
			{
				loader: 'a-loader',
				resolvedModule: 'liferay-npm-bundler-loader-a-loader',
				options: {},
				exec: requireReturn,
			},
		]);

		expect(rules.loadersForFile('/home/me/my-project/other.css')).toEqual(
			[]
		);
	});

	it('test and exclude', () => {
		const requireReturn = () => undefined;
		const rules = new Rules({
			_npmbundlerrc: {
				rules: [
					{
						test: '\\.css$',
						exclude: 'node_modules',
						use: 'a-loader',
					},
				],
			},
			require: () => requireReturn,
		});

		expect(rules.loadersForFile('/home/me/my-project/main.css')).toEqual([
			{
				loader: 'a-loader',
				resolvedModule: 'liferay-npm-bundler-loader-a-loader',
				options: {},
				exec: requireReturn,
			},
		]);

		expect(
			rules.loadersForFile(
				'/home/me/my-project/node_modules/a-package/main.css'
			)
		).toEqual([]);
	});

	it('test, include and exclude', () => {
		const requireReturn = () => undefined;
		const rules = new Rules({
			_npmbundlerrc: {
				rules: [
					{
						test: '\\.css$',
						include: 'main',
						exclude: 'node_modules',
						use: 'a-loader',
					},
				],
			},
			require: () => requireReturn,
		});

		expect(rules.loadersForFile('/home/me/my-project/main.css')).toEqual([
			{
				loader: 'a-loader',
				resolvedModule: 'liferay-npm-bundler-loader-a-loader',
				options: {},
				exec: requireReturn,
			},
		]);

		expect(rules.loadersForFile('/home/me/my-project/other.css')).toEqual(
			[]
		);

		expect(
			rules.loadersForFile(
				'/home/me/my-project/node_modules/a-package/main.css'
			)
		).toEqual([]);
	});
});

it('multiple rules', () => {
	const requireReturn = () => undefined;
	const rules = new Rules({
		_npmbundlerrc: {
			rules: [
				{
					test: '\\.css$',
					use: 'a-loader',
				},
				{
					test: 'main.css',
					use: 'another-loader',
				},
			],
		},
		require: () => requireReturn,
	});

	expect(rules.loadersForFile('/home/me/my-project/main.css')).toEqual([
		{
			loader: 'a-loader',
			resolvedModule: 'liferay-npm-bundler-loader-a-loader',
			options: {},
			exec: requireReturn,
		},
		{
			loader: 'another-loader',
			resolvedModule: 'liferay-npm-bundler-loader-another-loader',
			options: {},
			exec: requireReturn,
		},
	]);
});

it('rule with options', () => {
	const requireReturn = () => undefined;
	const rules = new Rules({
		_npmbundlerrc: {
			rules: [
				{
					test: '\\.js$',
					use: [
						'a-loader',
						{
							loader: 'babel-loader',
							options: {
								presets: ['env', 'react'],
							},
						},
					],
				},
			],
		},
		require: () => requireReturn,
	});

	expect(rules.loadersForFile('/home/me/my-project/main.js')).toEqual([
		{
			loader: 'a-loader',
			options: {},
			resolvedModule: 'liferay-npm-bundler-loader-a-loader',
			exec: requireReturn,
		},
		{
			loader: 'babel-loader',
			options: {
				presets: ['env', 'react'],
			},
			resolvedModule: 'liferay-npm-bundler-loader-babel-loader',
			exec: requireReturn,
		},
	]);
});
