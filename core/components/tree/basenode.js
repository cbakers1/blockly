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
 * @fileoverview Definition of the Blockly.tree.BaseNode class.
 * This class is similar to Closure's goog.ui.tree.BaseNode class.
 * @author samelh@google.com (Sam El-Husseini)
 */
'use strict';

goog.provide('Blockly.tree.BaseNode');

goog.require('Blockly.Component');
goog.require('Blockly.utils.aria');
goog.require('Blockly.utils.object');
goog.require('Blockly.utils.KeyCodes');
goog.require('Blockly.utils.style');


/**
 * An abstract base class for a node in the tree.
 * Similar to goog.ui.tree.BaseNode
 *
 * @param {string} content The content of the node label treated as
 *     plain-text and will be HTML escaped.
 * @param {!Blockly.tree.BaseNode.Config} config The configuration for the tree.
 * @constructor
 * @extends {Blockly.Component}
 */
Blockly.tree.BaseNode = function (content, config) {
    Blockly.Component.call(this);

    /**
     * The configuration for the tree.
     * @type {!Blockly.tree.BaseNode.Config}
     * @private
     */
    this.config_ = config;

    /**
     * Text content of the node label.
     * @type {string}
     * @private
     */
    this.content_ = content;

    /**
     * @type {string}
     * @private
     */
    this.iconClass_;

    /**
     * @type {string}
     * @private
     */
    this.expandedIconClass_;

    /**
     * @type {Blockly.tree.TreeControl}
     * @protected
     */
    this.tree;

    /**
     * @type {Blockly.tree.BaseNode}
     * @private
     */
    this.previousSibling_;

    /**
     * @type {Blockly.tree.BaseNode}
     * @private
     */
    this.nextSibling_;

    /**
     * @type {Blockly.tree.BaseNode}
     * @private
     */
    this.firstChild_;

    /**
     * @type {Blockly.tree.BaseNode}
     * @private
     */
    this.lastChild_;

    /**
     * Whether the tree item is selected.
     * @type {boolean}
     * @private
     */
    this.selected_ = false;

    /**
     * Whether the tree node is expanded.
     * @type {boolean}
     * @private
     */
    this.expanded_ = false;

    /**
     * Tooltip for the tree item
     * @type {?string}
     * @private
     */
    this.toolTip_ = null;

    /**
     * Whether to allow user to collapse this node.
     * @type {boolean}
     * @private
     */
    this.isUserCollapsible_ = true;

    /**
     * Nesting depth of this node; cached result of computeDepth_.
     * -1 if value has not been cached.
     * @type {number}
     * @private
     */
    this.depth_ = -1;
};
Blockly.utils.object.inherits(Blockly.tree.BaseNode, Blockly.Component);


/**
 * The config type for the tree.
 * @typedef {{
 *            indentWidth:number,
 *            cssRoot:string,
 *            cssHideRoot:string,
 *            cssTreeRow:string,
 *            cssItemLabel:string,
 *            cssTreeIcon:string,
 *            cssExpandedFolderIcon:string,
 *            cssCollapsedFolderIcon:string,
 *            cssFileIcon:string,
 *            cssSelectedRow:string
 *          }}
 */
Blockly.tree.BaseNode.Config;

/**
 * Map of nodes in existence. Needed to route events to the appropriate nodes.
 * Nodes are added to the map at {@link #enterDocument} time and removed at
 * {@link #exitDocument} time.
 * @type {Object}
 * @protected
 */
Blockly.tree.BaseNode.allNodes = {};

/** @override */
Blockly.tree.BaseNode.prototype.disposeInternal = function () {
    Blockly.tree.BaseNode.superClass_.disposeInternal.call(this);
    if (this.tree) {
        this.tree = null;
    }
    this.setElementInternal(null);
};


/**
 * Adds roles and states.
 * @protected
 */
Blockly.tree.BaseNode.prototype.initAccessibility = function () {
    var el = this.getElement();
    if (el) {
        // Set an id for the label
        var label = this.getLabelElement();
        if (label && !label.id) {
            label.id = this.getId() + '.label';
        }

        Blockly.utils.aria.setRole(el,
            Blockly.utils.aria.Role.TREEITEM);
        Blockly.utils.aria.setState(el,
            Blockly.utils.aria.State.SELECTED, false);
        Blockly.utils.aria.setState(el,
            Blockly.utils.aria.State.LEVEL, this.getDepth());
        if (label) {
            Blockly.utils.aria.setState(el,
                Blockly.utils.aria.State.LABELLEDBY, label.id);
        }

        var img = this.getIconElement();
        if (img) {
            Blockly.utils.aria.setRole(img, Blockly.utils.aria.Role.PRESENTATION);
        }

        var ce = this.getChildrenElement();
        if (ce) {
            Blockly.utils.aria.setRole(ce,
                Blockly.utils.aria.Role.GROUP);

            // In case the children will be created lazily.
            if (ce.hasChildNodes()) {
                // Only set aria-expanded if the node has children (can be expanded).
                Blockly.utils.aria.setState(el, Blockly.utils.aria.State.EXPANDED, false);

                // do setsize for each child
                var count = this.getChildCount();
                for (var i = 1; i <= count; i++) {
                    var child = /** @type {!Element} */ (this.getChildAt(i - 1).getElement());
                    Blockly.utils.aria.setState(child,
                        Blockly.utils.aria.State.SETSIZE, count);
                    Blockly.utils.aria.setState(child,
                        Blockly.utils.aria.State.POSINSET, i);
                }
            }
        }
    }
};


/** @override */
Blockly.tree.BaseNode.prototype.createDom = function () {
    var element = document.createElement('div');
    element.appendChild(this.toDom());
    this.setElementInternal(/** @type {!Element} */ (element));
};


/** @override */
Blockly.tree.BaseNode.prototype.enterDocument = function () {
    Blockly.tree.BaseNode.superClass_.enterDocument.call(this);
    Blockly.tree.BaseNode.allNodes[this.getId()] = this;
    this.initAccessibility();
};


/** @override */
Blockly.tree.BaseNode.prototype.exitDocument = function () {
    Blockly.tree.BaseNode.superClass_.exitDocument.call(this);
    delete Blockly.tree.BaseNode.allNodes[this.getId()];
};


/**
 * The method assumes that the child doesn't have parent node yet.
 * @override
 */
Blockly.tree.BaseNode.prototype.addChildAt = function (child, index) {
    child = /** @type {Blockly.tree.BaseNode} */ (child);
    var prevNode = this.getChildAt(index - 1);
    var nextNode = this.getChildAt(index);

    Blockly.tree.BaseNode.superClass_.addChildAt.call(this, child, index);

    child.previousSibling_ = prevNode;
    child.nextSibling_ = nextNode;

    if (prevNode) {
        prevNode.nextSibling_ = child;
    } else {
        this.firstChild_ = child;
    }
    if (nextNode) {
        nextNode.previousSibling_ = child;
    } else {
        this.lastChild_ = child;
    }

    var tree = this.getTree();
    if (tree) {
        child.setTreeInternal(tree);
    }

    child.setDepth_(this.getDepth() + 1);

    var el = this.getElement();
    if (el) {
        this.updateExpandIcon();
        Blockly.utils.aria.setState(
            el, Blockly.utils.aria.State.EXPANDED, this.getExpanded());
        if (this.getExpanded()) {
            var childrenEl = this.getChildrenElement();
            if (!child.getElement()) {
                child.createDom();
            }
            var childElement = child.getElement();
            var nextElement = nextNode && nextNode.getElement();
            childrenEl.insertBefore(childElement, nextElement);

            if (this.isInDocument()) {
                child.enterDocument();
            }

            if (!nextNode) {
                if (prevNode) {
                    prevNode.updateExpandIcon();
                } else {
                    Blockly.utils.style.setElementShown(childrenEl, true);
                    this.setExpanded(this.getExpanded());
                }
            }
        }
    }
};

/**
 * Appends a node as a child to the current node.
 * @param {Blockly.tree.BaseNode} child The child to add.
 * @package
 */
Blockly.tree.BaseNode.prototype.add = function (child) {
    if (child.getParent()) {
        throw Error(Blockly.Component.Error.PARENT_UNABLE_TO_BE_SET);
    }
    this.addChildAt(child, this.getChildCount());
};

/**
 * Returns the tree.
 * @return {?Blockly.tree.TreeControl} tree
 * @protected
 */
Blockly.tree.BaseNode.prototype.getTree = function () {
    return null;
};

/**
 * Returns the depth of the node in the tree. Should not be overridden.
 * @return {number} The non-negative depth of this node (the root is zero).
 * @protected
 */
Blockly.tree.BaseNode.prototype.getDepth = function () {
    var depth = this.depth_;
    if (depth < 0) {
        depth = this.computeDepth_();
        this.setDepth_(depth);
    }
    return depth;
};

/**
 * Computes the depth of the node in the tree.
 * Called only by getDepth, when the depth hasn't already been cached.
 * @return {number} The non-negative depth of this node (the root is zero).
 * @private
 */
Blockly.tree.BaseNode.prototype.computeDepth_ = function () {
    var parent = this.getParent();
    if (parent) {
        return parent.getDepth() + 1;
    } else {
        return 0;
    }
};

/**
 * Changes the depth of a node (and all its descendants).
 * @param {number} depth The new nesting depth; must be non-negative.
 * @private
 */
Blockly.tree.BaseNode.prototype.setDepth_ = function (depth) {
    if (depth != this.depth_) {
        this.depth_ = depth;
        var row = this.getRowElement();
        if (row) {
            var indent = this.getPixelIndent_() + 'px';
            if (this.isRightToLeft()) {
                row.style.paddingRight = indent;
            } else {
                row.style.paddingLeft = indent;
            }
        }
        this.forEachChild(function (child) {
            child.setDepth_(depth + 1);
        });
    }
};

/**
 * Returns true if the node is a descendant of this node
 * @param {Blockly.tree.BaseNode} node The node to check.
 * @return {boolean} True if the node is a descendant of this node, false
 *    otherwise.
 * @protected
 */
Blockly.tree.BaseNode.prototype.contains = function (node) {
    var current = node;
    while (current) {
        if (current == this) {
            return true;
        }
        current = current.getParent();
    }
    return false;
};

/**
 * This is re-defined here to indicate to the closure compiler the correct
 * child return type.
 * @param {number} index 0-based index.
 * @return {Blockly.tree.BaseNode} The child at the given index; null if none.
 * @protected
 */
Blockly.tree.BaseNode.prototype.getChildAt;

/**
 * Returns the children of this node.
 * @return {!Array.<!Blockly.tree.BaseNode>} The children.
 * @package
 */
Blockly.tree.BaseNode.prototype.getChildren = function () {
    var children = [];
    this.forEachChild(function (child) {
        children.push(child);
    });
    return children;
};

/**
 * @return {Blockly.tree.BaseNode} The first child of this node.
 * @protected
 */
Blockly.tree.BaseNode.prototype.getFirstChild = function () {
    return this.getChildAt(0);
};

/**
 * @return {Blockly.tree.BaseNode} The last child of this node.
 * @protected
 */
Blockly.tree.BaseNode.prototype.getLastChild = function () {
    return this.getChildAt(this.getChildCount() - 1);
};

/**
 * @return {Blockly.tree.BaseNode} The previous sibling of this node.
 * @protected
 */
Blockly.tree.BaseNode.prototype.getPreviousSibling = function () {
    return this.previousSibling_;
};

/**
 * @return {Blockly.tree.BaseNode} The next sibling of this node.
 * @protected
 */
Blockly.tree.BaseNode.prototype.getNextSibling = function () {
    return this.nextSibling_;
};

/**
 * @return {boolean} Whether the node is the last sibling.
 * @protected
 */
Blockly.tree.BaseNode.prototype.isLastSibling = function () {
    return !this.nextSibling_;
};

/**
 * @return {boolean} Whether the node is selected.
 * @protected
 */
Blockly.tree.BaseNode.prototype.isSelected = function () {
    return this.selected_;
};

/**
 * Selects the node.
 * @protected
 */
Blockly.tree.BaseNode.prototype.select = function () {
    var tree = this.getTree();
    if (tree) {
        tree.setSelectedItem(this);
    }
};

/**
 * Selects the first node.
 * @protected
 */
Blockly.tree.BaseNode.prototype.selectFirst = function () {
    var tree = this.getTree();
    if (tree && this.firstChild_) {
        tree.setSelectedItem(this.firstChild_);
    }
};

/**
 * Called from the tree to instruct the node change its selection state.
 * @param {boolean} selected The new selection state.
 * @protected
 */
Blockly.tree.BaseNode.prototype.setSelectedInternal = function (selected) {
    if (this.selected_ == selected) {
        return;
    }
    this.selected_ = selected;

    this.updateRow();

    var el = this.getElement();
    if (el) {
        Blockly.utils.aria.setState(el, Blockly.utils.aria.State.SELECTED, selected);
        if (selected) {
            var treeElement = /** @type {!Element} */ (this.getTree().getElement());
            Blockly.utils.aria.setState(treeElement,
                Blockly.utils.aria.State.ACTIVEDESCENDANT, this.getId());
        }
    }
};

/**
 * @return {boolean} Whether the node is expanded.
 * @protected
 */
Blockly.tree.BaseNode.prototype.getExpanded = function () {
    return this.expanded_;
};

/**
 * Sets the node to be expanded internally, without state change events.
 * @param {boolean} expanded Whether to expand or close the node.
 * @protected
 */
Blockly.tree.BaseNode.prototype.setExpandedInternal = function (expanded) {
    this.expanded_ = expanded;
};

/**
 * Sets the node to be expanded.
 * @param {boolean} expanded Whether to expand or close the node.
 * @package
 */
Blockly.tree.BaseNode.prototype.setExpanded = function (expanded) {
    var isStateChange = expanded != this.expanded_;
    var ce;
    this.expanded_ = expanded;
    var tree = this.getTree();
    var el = this.getElement();

    if (this.hasChildren()) {
        if (!expanded && tree && this.contains(tree.getSelectedItem())) {
            this.select();
        }

        if (el) {
            ce = this.getChildrenElement();
            if (ce) {
                Blockly.utils.style.setElementShown(ce, expanded);
                Blockly.utils.aria.setState(el, Blockly.utils.aria.State.EXPANDED, expanded);

                // Make sure we have the HTML for the children here.
                if (expanded && this.isInDocument() && !ce.hasChildNodes()) {
                    this.forEachChild(function (child) {
                        ce.appendChild(child.toDom());
                    });
                    this.forEachChild(function (child) {
                        child.enterDocument();
                    });
                }
            }
            this.updateExpandIcon();
        }
    } else {
        ce = this.getChildrenElement();
        if (ce) {
            Blockly.utils.style.setElementShown(ce, false);
        }
    }
    if (el) {
        this.updateIcon_();
    }

    if (isStateChange) {
        if (expanded) {
            this.doNodeExpanded();
        } else {
            this.doNodeCollapsed();
        }
    }
};

/**
 * Used to notify a node of that we have expanded it.
 * Can be overidden by subclasses, see Blockly.tree.TreeNode.
 * @protected
 */
Blockly.tree.BaseNode.prototype.doNodeExpanded = function () {
    // NOP
};

/**
 * Used to notify a node that we have collapsed it.
 * Can be overidden by subclasses, see Blockly.tree.TreeNode.
 * @protected
 */
Blockly.tree.BaseNode.prototype.doNodeCollapsed = function () {
    // NOP
};

/**
 * Toggles the expanded state of the node.
 * @protected
 */
Blockly.tree.BaseNode.prototype.toggle = function () {
    this.setExpanded(!this.getExpanded());
};

/**
 * @return {boolean} Whether the node is collapsible by user actions.
 * @protected
 */
Blockly.tree.BaseNode.prototype.isUserCollapsible = function () {
    return this.isUserCollapsible_;
};

/**
 * Creates HTML Element for the node.
 * @return {!Element} HTML element
 * @protected
 */
Blockly.tree.BaseNode.prototype.toDom = function () {
    var nonEmptyAndExpanded = this.getExpanded() && this.hasChildren();

    var children = document.createElement('div');
    children.style.backgroundPosition = this.getBackgroundPosition();
    if (!nonEmptyAndExpanded) {
        children.style.display = 'none';
    }

    if (nonEmptyAndExpanded) {
        // children
        this.forEachChild(function (child) {
            children.appendChild(child.toDom());
        });
    }

    var node = document.createElement('div');
    node.id = this.getId();

    node.appendChild(this.getRowDom());
    node.appendChild(children);

    return node;
};

/**
 * @return {number} The pixel indent of the row.
 * @private
 */
Blockly.tree.BaseNode.prototype.getPixelIndent_ = function () {
    return Math.max(0, (this.getDepth() - 1) * this.config_.indentWidth);
};

/**
 * @return {!Element} The HTML element for the row.
 * @protected
 */
Blockly.tree.BaseNode.prototype.getRowDom = function () {
    var row = document.createElement('div');
    row.className = this.getRowClassName();
    row.style['padding-' + (this.isRightToLeft() ? 'right' : 'left')] =
        this.getPixelIndent_() + 'px';

    row.appendChild(this.getIconDom());
    row.appendChild(this.getLabelDom());

    return row;
};

/**
 * @return {string} The class name for the row.
 * @protected
 */
Blockly.tree.BaseNode.prototype.getRowClassName = function () {
    var selectedClass = '';
    if (this.isSelected()) {
        selectedClass = ' ' + (this.config_.cssSelectedRow || '');
    }
    return this.config_.cssTreeRow + selectedClass;
};

/**
 * @return {!Element} The HTML element for the label.
 * @protected
 */
Blockly.tree.BaseNode.prototype.getLabelDom = function () {
    var label = document.createElement('span');
    label.className = this.config_.cssItemLabel || '';
    label.textContent = this.getText();
    return label;
};

/**
 * @return {!Element} The HTML for the icon.
 * @protected
 */
Blockly.tree.BaseNode.prototype.getIconDom = function () {
    var icon = document.createElement('span');
    icon.style.display = 'inline-block';
    icon.className = this.getCalculatedIconClass();
    return icon;
};

/**
 * Gets the calculated icon class.
 * @protected
 */
Blockly.tree.BaseNode.prototype.getCalculatedIconClass = function () {
    throw Error('unimplemented abstract method');
};

/**
 * @return {string} The background position style value.
 * @protected
 */
Blockly.tree.BaseNode.prototype.getBackgroundPosition = function () {
    return (this.isLastSibling() ? '-100' : (this.getDepth() - 1) *
        this.config_.indentWidth) + 'px 0';
};

/**
 * @return {Element} The element for the tree node.
 * @override
 */
Blockly.tree.BaseNode.prototype.getElement = function () {
    var el = Blockly.tree.BaseNode.superClass_.getElement.call(this);
    if (!el) {
        el = document.getElementById(this.getId());
        this.setElementInternal(el);
    }
    return el;
};

/**
 * @return {Element} The row is the div that is used to draw the node without
 *     the children.
 * @package
 */
Blockly.tree.BaseNode.prototype.getRowElement = function () {
    var el = this.getElement();
    return el ? /** @type {Element} */ (el.firstChild) : null;
};

/**
 * @return {Element} The icon element.
 * @protected
 */
Blockly.tree.BaseNode.prototype.getIconElement = function () {
    var el = this.getRowElement();
    return el ? /** @type {Element} */ (el.firstChild) : null;
};

/**
 * @return {Element} The label element.
 * @protected
 */
Blockly.tree.BaseNode.prototype.getLabelElement = function () {
    var el = this.getRowElement();
    return el && el.lastChild ?
        /** @type {Element} */ (el.lastChild.previousSibling) :
        null;
};

/**
 * @return {Element} The div containing the children.
 * @protected
 */
Blockly.tree.BaseNode.prototype.getChildrenElement = function () {
    var el = this.getElement();
    return el ? /** @type {Element} */ (el.lastChild) : null;
};

/**
 * Gets the icon class for the node.
 * @return {string} s The icon source.
 * @protected
 */
Blockly.tree.BaseNode.prototype.getIconClass = function () {
    return this.iconClass_;
};

/**
 * Gets the icon class for when the node is expanded.
 * @return {string} The class.
 * @protected
 */
Blockly.tree.BaseNode.prototype.getExpandedIconClass = function () {
    return this.expandedIconClass_;
};

/**
 * Sets the text of the label.
 * @param {string} s The plain text of the label.
 * @protected
 */
Blockly.tree.BaseNode.prototype.setText = function (s) {
    this.content_ = s;
};

/**
 * Returns the text of the label. If the text was originally set as HTML, the
 * return value is unspecified.
 * @return {string} The plain text of the label.
 * @package
 */
Blockly.tree.BaseNode.prototype.getText = function () {
    return this.content_;
};

/**
 * Updates the row styles.
 * @protected
 */
Blockly.tree.BaseNode.prototype.updateRow = function () {
    var rowEl = this.getRowElement();
    if (rowEl) {
        rowEl.className = this.getRowClassName();
    }
};

/**
 * Updates the expand icon of the node.
 * @protected
 */
Blockly.tree.BaseNode.prototype.updateExpandIcon = function () {
    var cel = this.getChildrenElement();
    if (cel) {
        cel.style.backgroundPosition = this.getBackgroundPosition();
    }
};

/**
 * Updates the icon of the node. Assumes that this.getElement() is created.
 * @private
 */
Blockly.tree.BaseNode.prototype.updateIcon_ = function () {
    this.getIconElement().className = this.getCalculatedIconClass();
};

/**
 * Handles mouse down event.
 * @param {!Event} e The browser event.
 * @protected
 */
Blockly.tree.BaseNode.prototype.onMouseDown = function (e) {
    var el = e.target;
    // expand icon
    var type = el.getAttribute('type');
    if (type == 'expand' && this.hasChildren()) {
        if (this.isUserCollapsible_) {
            this.toggle();
        }
        return;
    }

    this.select();
    this.updateRow();
};

/**
 * Handles a click event.
 * @param {!Event} e The browser event.
 * @protected
 */
Blockly.tree.BaseNode.prototype.onClick_ = function (e) {
    e.preventDefault();
};

/**
 * Handles a key down event.
 * @param {!Event} e The browser event.
 * @return {boolean} The handled value.
 * @protected
 */
Blockly.tree.BaseNode.prototype.onKeyDown = function (e) {
    var handled = true;
    switch (e.keyCode) {
        case Blockly.utils.KeyCodes.RIGHT:
            if (e.altKey) {
                break;
            }
            handled = this.selectChild();
            break;

        case Blockly.utils.KeyCodes.LEFT:
            if (e.altKey) {
                break;
            }
            handled = this.selectParent();
            break;

        case Blockly.utils.KeyCodes.DOWN:
            handled = this.selectNext();
            break;

        case Blockly.utils.KeyCodes.UP:
            handled = this.selectPrevious();
            break;

        default:
            handled = false;
    }

    if (handled) {
        e.preventDefault();
    }

    return handled;
};


/**
 * Select the next node.
 * @return {boolean} True if the action has been handled, false otherwise.
 * @package
 */
Blockly.tree.BaseNode.prototype.selectNext = function () {
    var nextNode = this.getNextShownNode();
    if (nextNode) {
        nextNode.select();
    }
    return true;
};

/**
 * Select the previous node.
 * @return {boolean} True if the action has been handled, false otherwise.
 * @package
 */
Blockly.tree.BaseNode.prototype.selectPrevious = function () {
    var previousNode = this.getPreviousShownNode();
    if (previousNode) {
        previousNode.select();
    }
    return true;
};

/**
 * Select the parent node or collapse the current node.
 * @return {boolean} True if the action has been handled, false otherwise.
 * @package
 */
Blockly.tree.BaseNode.prototype.selectParent = function () {
    if (this.hasChildren() && this.getExpanded() && this.isUserCollapsible_) {
        this.setExpanded(false);
    } else {
        var parent = this.getParent();
        var tree = this.getTree();
        // don't go to root if hidden
        if (parent && (parent != tree)) {
            parent.select();
        }
    }
    return true;
};

/**
 * Expand the current node if it's not already expanded, or select the
 * child node.
 * @return {boolean} True if the action has been handled, false otherwise.
 * @package
 */
Blockly.tree.BaseNode.prototype.selectChild = function () {
    if (this.hasChildren()) {
        if (!this.getExpanded()) {
            this.setExpanded(true);
        } else {
            this.getFirstChild().select();
        }
        return true;
    }
    return false;
};

/**
 * @return {Blockly.tree.BaseNode} The last shown descendant.
 * @protected
 */
Blockly.tree.BaseNode.prototype.getLastShownDescendant = function () {
    if (!this.getExpanded() || !this.hasChildren()) {
        return this;
    }
    // we know there is at least 1 child
    return this.getLastChild().getLastShownDescendant();
};

/**
 * @return {Blockly.tree.BaseNode} The next node to show or null if there isn't
 *     a next node to show.
 * @protected
 */
Blockly.tree.BaseNode.prototype.getNextShownNode = function () {
    if (this.hasChildren() && this.getExpanded()) {
        return this.getFirstChild();
    } else {
        var parent = this;
        var next;
        while (parent != this.getTree()) {
            next = parent.getNextSibling();
            if (next != null) {
                return next;
            }
            parent = parent.getParent();
        }
        return null;
    }
};

/**
 * @return {Blockly.tree.BaseNode} The previous node to show.
 * @protected
 */
Blockly.tree.BaseNode.prototype.getPreviousShownNode = function () {
    var ps = this.getPreviousSibling();
    if (ps != null) {
        return ps.getLastShownDescendant();
    }
    var parent = this.getParent();
    var tree = this.getTree();
    if (parent == tree) {
        return null;
    }
    // The root is the first node.
    if (this == tree) {
        return null;
    }
    return /** @type {Blockly.tree.BaseNode} */ (parent);
};

/**
 * @return {!Blockly.tree.BaseNode.Config} The configuration for the tree.
 * @protected
 */
Blockly.tree.BaseNode.prototype.getConfig = function () {
    return this.config_;
};

/**
 * Internal method that is used to set the tree control on the node.
 * @param {Blockly.tree.TreeControl} tree The tree control.
 * @protected
 */
Blockly.tree.BaseNode.prototype.setTreeInternal = function (tree) {
    if (this.tree != tree) {
        this.tree = tree;
        this.forEachChild(function (child) {
            child.setTreeInternal(tree);
        });
    }
};
