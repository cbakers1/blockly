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
 * @fileoverview Constant declarations for common key codes.
 * These methods are not specific to Blockly, and could be factored out into
 * a JavaScript framework such as Closure.
 * @author samelh@google.com (Sam El-Husseini)
 */
'use strict';

goog.provide('Blockly.utils.aria');


/**
 * ARIA states/properties prefix.
 * @private
 */
Blockly.utils.aria.ARIA_PREFIX_ = 'aria-';

/**
 * ARIA role attribute.
 * @private
 */
Blockly.utils.aria.ROLE_ATTRIBUTE_ = 'role';

/**
 * ARIA role values.
 * Copied from Closure's goog.a11y.aria.Role
 * @enum {string}
 */
Blockly.utils.aria.Role = {
    // ARIA role for an alert element that doesn't need to be explicitly closed.
    ALERT: 'alert',

    // ARIA role for an alert dialog element that takes focus and must be closed.
    ALERTDIALOG: 'alertdialog',

    // ARIA role for an application that implements its own keyboard navigation.
    APPLICATION: 'application',

    // ARIA role for an article.
    ARTICLE: 'article',

    // ARIA role for a banner containing mostly site content, not page content.
    BANNER: 'banner',

    // ARIA role for a button element.
    BUTTON: 'button',

    // ARIA role for a checkbox button element; use with the CHECKED state.
    CHECKBOX: 'checkbox',

    // ARIA role for a column header of a table or grid.
    COLUMNHEADER: 'columnheader',

    // ARIA role for a combo box element.
    COMBOBOX: 'combobox',

    // ARIA role for a supporting section of the document.
    COMPLEMENTARY: 'complementary',

    // ARIA role for a large perceivable region that contains information
    // about the parent document.
    CONTENTINFO: 'contentinfo',

    // ARIA role for a definition of a term or concept.
    DEFINITION: 'definition',

    // ARIA role for a dialog, some descendant must take initial focus.
    DIALOG: 'dialog',

    // ARIA role for a directory, like a table of contents.
    DIRECTORY: 'directory',

    // ARIA role for a part of a page that's a document, not a web application.
    DOCUMENT: 'document',

    // ARIA role for a landmark region logically considered one form.
    FORM: 'form',

    // ARIA role for an interactive control of tabular data.
    GRID: 'grid',

    // ARIA role for a cell in a grid.
    GRIDCELL: 'gridcell',

    // ARIA role for a group of related elements like tree item siblings.
    GROUP: 'group',

    // ARIA role for a heading element.
    HEADING: 'heading',

    // ARIA role for a container of elements that together comprise one image.
    IMG: 'img',

    // ARIA role for a link.
    LINK: 'link',

    // ARIA role for a list of non-interactive list items.
    LIST: 'list',

    // ARIA role for a listbox.
    LISTBOX: 'listbox',

    // ARIA role for a list item.
    LISTITEM: 'listitem',

    // ARIA role for a live region where new information is added.
    LOG: 'log',

    // ARIA landmark role for the main content in a document. Use only once.
    MAIN: 'main',

    // ARIA role for a live region of non-essential information that changes.
    MARQUEE: 'marquee',

    // ARIA role for a mathematical expression.
    MATH: 'math',

    // ARIA role for a popup menu.
    MENU: 'menu',

    // ARIA role for a menubar element containing menu elements.
    MENUBAR: 'menubar',

    // ARIA role for menu item elements.
    MENUITEM: 'menuitem',

    // ARIA role for a checkbox box element inside a menu.
    MENUITEMCHECKBOX: 'menuitemcheckbox',

    // ARIA role for a radio button element inside a menu.
    MENUITEMRADIO: 'menuitemradio',

    // ARIA landmark role for a collection of navigation links.
    NAVIGATION: 'navigation',

    // ARIA role for a section ancillary to the main content.
    NOTE: 'note',

    // ARIA role for option items that are  children of combobox, listbox, menu,
    // radiogroup, or tree elements.
    OPTION: 'option',

    // ARIA role for ignorable cosmetic elements with no semantic significance.
    PRESENTATION: 'presentation',

    // ARIA role for a progress bar element.
    PROGRESSBAR: 'progressbar',

    // ARIA role for a radio button element.
    RADIO: 'radio',

    // ARIA role for a group of connected radio button elements.
    RADIOGROUP: 'radiogroup',

    // ARIA role for an important region of the page.
    REGION: 'region',

    // ARIA role for a row of cells in a grid.
    ROW: 'row',

    // ARIA role for a group of one or more rows in a grid.
    ROWGROUP: 'rowgroup',

    // ARIA role for a row header of a table or grid.
    ROWHEADER: 'rowheader',

    // ARIA role for a scrollbar element.
    SCROLLBAR: 'scrollbar',

    // ARIA landmark role for a part of the page providing search functionality.
    SEARCH: 'search',

    // ARIA role for a menu separator.
    SEPARATOR: 'separator',

    // ARIA role for a slider.
    SLIDER: 'slider',

    // ARIA role for a spin button.
    SPINBUTTON: 'spinbutton',

    // ARIA role for a live region with advisory info less severe than an alert.
    STATUS: 'status',

    // ARIA role for a tab button.
    TAB: 'tab',

    // ARIA role for a table.
    TABLE: 'table',

    // ARIA role for a tab bar (i.e. a list of tab buttons).
    TABLIST: 'tablist',

    // ARIA role for a tab page (i.e. the element holding tab contents).
    TABPANEL: 'tabpanel',

    // ARIA role for a textbox element.
    TEXTBOX: 'textbox',

    // ARIA role for a textinfo element.
    TEXTINFO: 'textinfo',

    // ARIA role for an element displaying elapsed time or time remaining.
    TIMER: 'timer',

    // ARIA role for a toolbar element.
    TOOLBAR: 'toolbar',

    // ARIA role for a tooltip element.
    TOOLTIP: 'tooltip',

    // ARIA role for a tree.
    TREE: 'tree',

    // ARIA role for a grid whose rows can be expanded and collapsed like a tree.
    TREEGRID: 'treegrid',

    // ARIA role for a tree item that sometimes may be expanded or collapsed.
    TREEITEM: 'treeitem'
};

/**
 * ARIA states and properties.
 * Copied from Closure's goog.a11y.aria.State
 * @enum {string}
 */
Blockly.utils.aria.State = {
    // ARIA property for setting the currently active descendant of an element,
    // for example the selected item in a list box. Value: ID of an element.
    ACTIVEDESCENDANT: 'activedescendant',

    // ARIA property that, if true, indicates that all of a changed region should
    // be presented, instead of only parts. Value: one of {true, false}.
    ATOMIC: 'atomic',

    // ARIA property to specify that input completion is provided. Value:
    // one of {'inline', 'list', 'both', 'none'}.
    AUTOCOMPLETE: 'autocomplete',

    // ARIA state to indicate that an element and its subtree are being updated.
    // Value: one of {true, false}.
    BUSY: 'busy',

    // ARIA state for a checked item. Value: one of {'true', 'false', 'mixed',
    // undefined}.
    CHECKED: 'checked',

    // ARIA state that defines an element's column index or position with respect
    // to the total number of columns within a table, grid, or treegrid.
    // Value: number.
    COLINDEX: 'colindex',

    // ARIA property that identifies the element or elements whose contents or
    // presence are controlled by this element.
    // Value: space-separated IDs of other elements.
    CONTROLS: 'controls',

    // ARIA property that identifies the element or elements that describe
    // this element. Value: space-separated IDs of other elements.
    DESCRIBEDBY: 'describedby',

    // ARIA state for a disabled item. Value: one of {true, false}.
    DISABLED: 'disabled',

    // ARIA property that indicates what functions can be performed when a
    // dragged object is released on the drop target.  Value: one of
    // {'copy', 'move', 'link', 'execute', 'popup', 'none'}.
    DROPEFFECT: 'dropeffect',

    // ARIA state for setting whether the element like a tree node is expanded.
    // Value: one of {true, false, undefined}.
    EXPANDED: 'expanded',

    // ARIA property that identifies the next element (or elements) in the
    // recommended reading order of content. Value: space-separated ids of
    // elements to flow to.
    FLOWTO: 'flowto',

    // ARIA state that indicates an element's "grabbed" state in drag-and-drop.
    // Value: one of {true, false, undefined}.
    GRABBED: 'grabbed',

    // ARIA property indicating whether the element has a popup.
    // Value: one of {true, false}.
    HASPOPUP: 'haspopup',

    // ARIA state indicating that the element is not visible or perceivable
    // to any user. Value: one of {true, false}.
    HIDDEN: 'hidden',

    // ARIA state indicating that the entered value does not conform. Value:
    // one of {false, true, 'grammar', 'spelling'}
    INVALID: 'invalid',

    // ARIA property that provides a label to override any other text, value, or
    // contents used to describe this element. Value: string.
    LABEL: 'label',

    // ARIA property for setting the element which labels another element.
    // Value: space-separated IDs of elements.
    LABELLEDBY: 'labelledby',

    // ARIA property for setting the level of an element in the hierarchy.
    // Value: integer.
    LEVEL: 'level',

    // ARIA property indicating that an element will be updated, and
    // describes the types of updates the user agents, assistive technologies,
    // and user can expect from the live region. Value: one of {'off', 'polite',
    // 'assertive'}.
    LIVE: 'live',

    // ARIA property indicating whether a text box can accept multiline input.
    // Value: one of {true, false}.
    MULTILINE: 'multiline',

    // ARIA property indicating if the user may select more than one item.
    // Value: one of {true, false}.
    MULTISELECTABLE: 'multiselectable',

    // ARIA property indicating if the element is horizontal or vertical.
    // Value: one of {'vertical', 'horizontal'}.
    ORIENTATION: 'orientation',

    // ARIA property creating a visual, functional, or contextual parent/child
    // relationship when the DOM hierarchy can't be used to represent it.
    // Value: Space-separated IDs of elements.
    OWNS: 'owns',

    // ARIA property that defines an element's number of position in a list.
    // Value: integer.
    POSINSET: 'posinset',

    // ARIA state for a pressed item.
    // Value: one of {true, false, undefined, 'mixed'}.
    PRESSED: 'pressed',

    // ARIA property indicating that an element is not editable.
    // Value: one of {true, false}.
    READONLY: 'readonly',

    // ARIA property indicating that change notifications within this subtree
    // of a live region should be announced. Value: one of {'additions',
    // 'removals', 'text', 'all', 'additions text'}.
    RELEVANT: 'relevant',

    // ARIA property indicating that user input is required on this element
    // before a form may be submitted. Value: one of {true, false}.
    REQUIRED: 'required',

    // ARIA state that defines an element's row index or position with respect
    // to the total number of rows within a table, grid, or treegrid.
    // Value: number.
    ROWINDEX: 'rowindex',

    // ARIA state for setting the currently selected item in the list.
    // Value: one of {true, false, undefined}.
    SELECTED: 'selected',

    // ARIA property defining the number of items in a list. Value: integer.
    SETSIZE: 'setsize',

    // ARIA property indicating if items are sorted. Value: one of {'ascending',
    // 'descending', 'none', 'other'}.
    SORT: 'sort',

    // ARIA property for slider maximum value. Value: number.
    VALUEMAX: 'valuemax',

    // ARIA property for slider minimum value. Value: number.
    VALUEMIN: 'valuemin',

    // ARIA property for slider active value. Value: number.
    VALUENOW: 'valuenow',

    // ARIA property for slider active value represented as text.
    // Value: string.
    VALUETEXT: 'valuetext'
};

/**
 * Sets the role of an element. If the roleName is
 * empty string or null, the role for the element is removed.
 * We encourage clients to call the goog.a11y.aria.removeRole
 * method instead of setting null and empty string values.
 * Special handling for this case is added to ensure
 * backword compatibility with existing code.
 *
 * Similar to Closure's goog.a11y.aria
 *
 * @param {!Element} element DOM node to set role of.
 * @param {!Blockly.utils.aria.Role|string} roleName role name(s).
 */
Blockly.utils.aria.setRole = function (element, roleName) {
    if (!roleName) {
        // Setting the ARIA role to empty string is not allowed
        // by the ARIA standard.
        Blockly.utils.aria.removeRole(element);
    } else {
        element.setAttribute(Blockly.utils.aria.ROLE_ATTRIBUTE_, roleName);
    }
};

/**
 * Gets role of an element.
 * Copied from Closure's goog.a11y.aria
 * @param {!Element} element DOM element to get role of.
 * @return {?Blockly.utils.aria.Role} ARIA Role name.
 */
Blockly.utils.aria.getRole = function (element) {
    var role = element.getAttribute(Blockly.utils.aria.ROLE_ATTRIBUTE_);
    return /** @type {Blockly.utils.aria.Role} */ (role) || null;
};

/**
 * Removes role of an element.
 * Copied from Closure's goog.a11y.aria
 * @param {!Element} element DOM element to remove the role from.
 */
Blockly.utils.aria.removeRole = function (element) {
    element.removeAttribute(Blockly.utils.aria.ROLE_ATTRIBUTE_);
};

/**
 * Sets the state or property of an element.
 * Copied from Closure's goog.a11y.aria
 * @param {!Element} element DOM node where we set state.
 * @param {!(Blockly.utils.aria.State|string)} stateName State attribute being set.
 *     Automatically adds prefix 'aria-' to the state name if the attribute is
 *     not an extra attribute.
 * @param {string|boolean|number|!Array.<string>} value Value
 * for the state attribute.
 */
Blockly.utils.aria.setState = function (element, stateName, value) {
    if (Array.isArray(value)) {
        value = value.join(' ');
    }
    var attrStateName = Blockly.utils.aria.getAriaAttributeName_(stateName);
    element.setAttribute(attrStateName, value);
};

/**
 * Adds the 'aria-' prefix to ariaName.
 * Copied from Closure's goog.a11y.aria
 * @param {string} ariaName ARIA state/property name.
 * @private
 * @return {string} The ARIA attribute name with added 'aria-' prefix.
 * @throws {Error} If no such attribute exists.
 */
Blockly.utils.aria.getAriaAttributeName_ = function (ariaName) {
    return Blockly.utils.aria.ARIA_PREFIX_ + ariaName;
};
