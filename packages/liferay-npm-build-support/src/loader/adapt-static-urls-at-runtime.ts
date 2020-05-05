/**
 * SPDX-FileCopyrightText: © 2020 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import globby from 'globby';
import {
	BundlerLoaderContext,
	BundlerLoaderReturn,
} from 'liferay-npm-build-tools-common/lib/api/loaders';
import FilePath from 'liferay-npm-build-tools-common/lib/file-path';
import project from 'liferay-npm-build-tools-common/lib/project';
import {escapeStringRegexp} from 'liferay-npm-build-tools-common/lib/regexp';

import {replaceTokens} from './util';

/** Configuration options for `adapt-static-urls` loader */
export interface Options {
	/** Project relative path of directory containing assets */
	docroot: string;

	/** List of regexps to match assets that need their URL to be processed */
	include: string[] | string;

	/** Whether to look for the whole URL inside the string or just a part */
	matchSubstring: boolean;
}

/**
 * A loader to rewrite static asset URLs inside a file (usually a webpack
 * generated bundle).
 *
 * This loader prepends the configured web context path to the static asset URLs
 * so that they can be retrieved from a Liferay server.
 *
 * The web context path is taken from property
 * [create-jar.features.web-context](https://github.com/liferay/liferay-js-toolkit/wiki/.npmbundlerrc-file-reference#create-jarfeaturesweb-context).
 * inside `.npmbundlerrc`.
 */
export default function(
	context: BundlerLoaderContext<string>,
	options: Options
): BundlerLoaderReturn {
	const {content, log} = context;
	const {docroot, include, matchSubstring = false} = replaceTokens(options);

	const docrootDir: FilePath = project.dir.join(
		new FilePath(docroot, {posix: true})
	);

	const filePosixPaths = globby
		.sync(`${docrootDir.asPosix}/**`, {
			absolute: true,
			onlyFiles: true,
			followSymbolicLinks: false,
		})
		.map(filePath => docrootDir.relative(filePath).asPosix);

	const patterns: RegExp[] = Array.isArray(include)
		? include.map(item => new RegExp(item))
		: [new RegExp(include)];

	let modifiedContent = content;

	const matchPrefix = matchSubstring ? '[^"]*' : '';

	filePosixPaths.forEach(filePosixPath => {
		if (!patterns.some(pattern => pattern.test(filePosixPath))) {
			return;
		}

		const regexp = new RegExp(
			`"${matchPrefix}${escapeStringRegexp(filePosixPath)}"`,
			'g'
		);

		const matches = regexp.exec(content);

		if (!matches) {
			return;
		}

		log.info(
			'adapt-static-urls',
			`Adapted ${matches.length} occurrences of URL '${filePosixPath}'`
		);

		modifiedContent = modifiedContent.replace(
			regexp,
			`_ADAPT_RT_.adaptStaticURL("${filePosixPath}")`
		);
	});

	return modifiedContent;
}
