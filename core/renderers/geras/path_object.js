/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview An object that owns a block's rendering SVG elements.
 * @author fenichel@google.com (Rachel Fenichel)
 */

'use strict';

goog.provide('Blockly.geras.PathObject');

goog.require('Blockly.blockRendering.IPathObject');
goog.require('Blockly.utils.dom');


/**
 * An object that handles creating and setting each of the SVG elements
 * used by the renderer.
 * @param {!SVGElement} root The root SVG element.
 * @constructor
 * @implements {Blockly.blockRendering.IPathObject}
 * @package
 */
Blockly.geras.PathObject = function (root) {
    this.svgRoot = root;

    // The order of creation for these next three matters, because that
    // effectively sets their z-indices.

    /**
     * The dark path of the block.
     * @type {SVGElement}
     * @package
     */
    this.svgPathDark = Blockly.utils.dom.createSvgElement('path',
        {'class': 'blocklyPathDark', 'transform': 'translate(1,1)'},
        this.svgRoot);

    /**
     * The primary path of the block.
     * @type {SVGElement}
     * @package
     */
    this.svgPath = Blockly.utils.dom.createSvgElement('path',
        {'class': 'blocklyPath'}, this.svgRoot);

    /**
     * The light path of the block.
     * @type {SVGElement}
     * @package
     */
    this.svgPathLight = Blockly.utils.dom.createSvgElement('path',
        {'class': 'blocklyPathLight'}, this.svgRoot);
};

/**
 * Set each of the paths generated by the renderer onto the respective SVG element.
 * @param {string} mainPath The main path.
 * @param {string} highlightPath The highlight path.
 * @package
 */
Blockly.geras.PathObject.prototype.setPaths = function (mainPath, highlightPath) {
    this.svgPath.setAttribute('d', mainPath);
    this.svgPathDark.setAttribute('d', mainPath);
    this.svgPathLight.setAttribute('d', highlightPath);
};

/**
 * Flip the SVG paths in RTL.
 * @package
 */
Blockly.geras.PathObject.prototype.flipRTL = function () {
    // Mirror the block's path.
    this.svgPath.setAttribute('transform', 'scale(-1 1)');
    this.svgPathLight.setAttribute('transform', 'scale(-1 1)');
    this.svgPathDark.setAttribute('transform', 'translate(1,1) scale(-1 1)');
};