[![npm version](https://badge.fury.io/js/%40netsells%2Fsimulate-user.svg)](https://badge.fury.io/js/%40netsells%2Fsimulate-user)
[![Build Status](https://travis-ci.org/netsells/simulate-user.svg?branch=master)](https://travis-ci.org/netsells/simulate-user)
[![codecov](https://codecov.io/gh/netsells/simulate-user/branch/master/graph/badge.svg)](https://codecov.io/gh/netsells/simulate-user)
[![Mutation testing badge](https://badge.stryker-mutator.io/github.com/netsells/simulate-user/master)](https://stryker-mutator.github.io)

# @netsells/simulate-user

Library for simulating user interactions using JavaScript in the browser

## Installation

```bash
yarn add @netsells/simulate-user
```

## Usage

```
import SimulateUser from '@netsells/simulate-user';

const sim = new SimulateUser();

const el = await sim.find({ query: 'a', text: 'Click me' });
await el.click();
```

# Documentation

## Classes

<dl>
<dt><a href="#DebugUser">DebugUser</a></dt>
<dd><p>Helper class for providing debug information.</p>
</dd>
<dt><a href="#SimulateUser">SimulateUser</a></dt>
<dd><p>Simulate a user.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#getDebugUser">getDebugUser(Klass)</a> ⇒ <code>object</code></dt>
<dd><p>Get a debug user extending a user class.user.</p>
</dd>
<dt><a href="#get">get(target, prop)</a> ⇒ <code>any</code></dt>
<dd><p>Get the needed property.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#SearchProperties">SearchProperties</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#ValueSelector">ValueSelector</a> : <code><a href="#SearchProperties">SearchProperties</a></code> | <code>string</code> | <code>number</code></dt>
<dd><p>A generic value selector. For a <code>textarea</code> or <code>input</code> it should always be a
string or number, for a <code>select</code> it can be a string or a <code>SearchProperties</code>.</p>
</dd>
</dl>

<a name="DebugUser"></a>

## DebugUser
Helper class for providing debug information.

**Kind**: global class  

* [DebugUser](#DebugUser)
    * [new DebugUser(...args)](#new_DebugUser_new)
    * [.build(...args)](#DebugUser+build) ⇒ <code>Proxy.&lt;object&gt;</code>
    * [.emit(callback, ...args)](#DebugUser+emit)
    * [.on(...args)](#DebugUser+on)

<a name="new_DebugUser_new"></a>

### new DebugUser(...args)
Setup the class.


| Param | Type |
| --- | --- |
| ...args | <code>any</code> | 

<a name="DebugUser+build"></a>

### debugUser.build(...args) ⇒ <code>Proxy.&lt;object&gt;</code>
Generate a instance using the same class constructor and debug emitter.

**Kind**: instance method of [<code>DebugUser</code>](#DebugUser)  

| Param | Type |
| --- | --- |
| ...args | <code>any</code> | 

<a name="DebugUser+emit"></a>

### debugUser.emit(callback, ...args)
Emit and log an event.

**Kind**: instance method of [<code>DebugUser</code>](#DebugUser)  

| Param | Type |
| --- | --- |
| callback | <code>string</code> | 
| ...args | <code>any</code> | 

<a name="DebugUser+on"></a>

### debugUser.on(...args)
Listen to a debug event.

**Kind**: instance method of [<code>DebugUser</code>](#DebugUser)  

| Param | Type |
| --- | --- |
| ...args | <code>any</code> | 

<a name="SimulateUser"></a>

## SimulateUser
Simulate a user.

**Kind**: global class  

* [SimulateUser](#SimulateUser)
    * [new SimulateUser(node)](#new_SimulateUser_new)
    * [.visible](#SimulateUser+visible) ⇒ <code>boolean</code>
    * [.hidden](#SimulateUser+hidden) ⇒ <code>boolean</code>
    * [.nextElementSibling](#SimulateUser+nextElementSibling) ⇒ [<code>SimulateUser</code>](#SimulateUser) \| <code>null</code>
    * [.options](#SimulateUser+options) ⇒ <code>Array.&lt;string&gt;</code>
    * [.text](#SimulateUser+text) ⇒ <code>string</code>
    * [.directText](#SimulateUser+directText) ⇒ <code>string</code>
    * [.parentElement](#SimulateUser+parentElement) ⇒ [<code>SimulateUser</code>](#SimulateUser)
    * [.className](#SimulateUser+className) ⇒ <code>string</code>
    * [.value](#SimulateUser+value) ⇒ <code>string</code>
    * [.htmlFor](#SimulateUser+htmlFor) ⇒ <code>string</code>
    * [.tag](#SimulateUser+tag) ⇒ <code>string</code>
    * [.build(...args)](#SimulateUser+build) ⇒ [<code>Proxy.&lt;SimulateUser&gt;</code>](#SimulateUser)
    * [.sleep(timeout)](#SimulateUser+sleep) ⇒ <code>Promise.&lt;undefined&gt;</code>
    * [.timeout(func, limit)](#SimulateUser+timeout) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [.getEventOptions(options)](#SimulateUser+getEventOptions) ⇒ <code>object</code>
    * [.querySelectorAll(query)](#SimulateUser+querySelectorAll) ⇒ [<code>Array.&lt;SimulateUser&gt;</code>](#SimulateUser)
    * [.getElementById(id)](#SimulateUser+getElementById) ⇒ [<code>SimulateUser</code>](#SimulateUser) \| <code>null</code>
    * [.getElementsByName(name)](#SimulateUser+getElementsByName) ⇒ [<code>Array.&lt;SimulateUser&gt;</code>](#SimulateUser)
    * [.closest(...args)](#SimulateUser+closest) ⇒ [<code>SimulateUser</code>](#SimulateUser) \| <code>null</code>
    * [.all(options)](#SimulateUser+all) ⇒ [<code>SimulateUser</code>](#SimulateUser) \| <code>null</code>
    * [.first(options)](#SimulateUser+first) ⇒ [<code>SimulateUser</code>](#SimulateUser) \| <code>null</code>
    * [.find(options, limit)](#SimulateUser+find) ⇒ [<code>SimulateUser</code>](#SimulateUser)
    * [.field(label, [findOptions])](#SimulateUser+field) ⇒ [<code>SimulateUser</code>](#SimulateUser) \| <code>null</code>
    * [.fieldSet(legend)](#SimulateUser+fieldSet) ⇒ [<code>SimulateUser</code>](#SimulateUser) \| <code>null</code>
    * [.dispatchEvent(event)](#SimulateUser+dispatchEvent)
    * [.click(search)](#SimulateUser+click)
    * [.attach(files)](#SimulateUser+attach)
    * [.check(checked)](#SimulateUser+check)
    * [.focus()](#SimulateUser+focus)
    * [.blur()](#SimulateUser+blur)
    * [.typeKey(key)](#SimulateUser+typeKey)
    * [.type(text)](#SimulateUser+type)
    * [.typeValue(text)](#SimulateUser+typeValue)
    * [.fillIn(label, value)](#SimulateUser+fillIn) ⇒ [<code>SimulateUser</code>](#SimulateUser)
    * [.fill(value)](#SimulateUser+fill)
    * [.select(value)](#SimulateUser+select)
    * [.sendChangeEvent()](#SimulateUser+sendChangeEvent)

<a name="new_SimulateUser_new"></a>

### new SimulateUser(node)
Create a SimulateUser class for a page element.


| Param | Type |
| --- | --- |
| node | <code>HTMLElement</code> | 

<a name="SimulateUser+visible"></a>

### simulateUser.visible ⇒ <code>boolean</code>
Check if the node is visible.

**Kind**: instance property of [<code>SimulateUser</code>](#SimulateUser)  
<a name="SimulateUser+hidden"></a>

### simulateUser.hidden ⇒ <code>boolean</code>
Check if the node is hidden.

**Kind**: instance property of [<code>SimulateUser</code>](#SimulateUser)  
<a name="SimulateUser+nextElementSibling"></a>

### simulateUser.nextElementSibling ⇒ [<code>SimulateUser</code>](#SimulateUser) \| <code>null</code>
NextElementSibling but returns a wrapper.

**Kind**: instance property of [<code>SimulateUser</code>](#SimulateUser)  
<a name="SimulateUser+options"></a>

### simulateUser.options ⇒ <code>Array.&lt;string&gt;</code>
Get all select option values.

**Kind**: instance property of [<code>SimulateUser</code>](#SimulateUser)  
<a name="SimulateUser+text"></a>

### simulateUser.text ⇒ <code>string</code>
Get trimmed text content.

**Kind**: instance property of [<code>SimulateUser</code>](#SimulateUser)  
<a name="SimulateUser+directText"></a>

### simulateUser.directText ⇒ <code>string</code>
Get text content which is a direct child of this node.

**Kind**: instance property of [<code>SimulateUser</code>](#SimulateUser)  
<a name="SimulateUser+parentElement"></a>

### simulateUser.parentElement ⇒ [<code>SimulateUser</code>](#SimulateUser)
Get the parentElement in a wrapper.

**Kind**: instance property of [<code>SimulateUser</code>](#SimulateUser)  
<a name="SimulateUser+className"></a>

### simulateUser.className ⇒ <code>string</code>
Proxy for className.

**Kind**: instance property of [<code>SimulateUser</code>](#SimulateUser)  
<a name="SimulateUser+value"></a>

### simulateUser.value ⇒ <code>string</code>
Proxy for value.

**Kind**: instance property of [<code>SimulateUser</code>](#SimulateUser)  
<a name="SimulateUser+htmlFor"></a>

### simulateUser.htmlFor ⇒ <code>string</code>
Proxy for htmlFor.

**Kind**: instance property of [<code>SimulateUser</code>](#SimulateUser)  
<a name="SimulateUser+tag"></a>

### simulateUser.tag ⇒ <code>string</code>
TagName but lower case.

**Kind**: instance property of [<code>SimulateUser</code>](#SimulateUser)  
<a name="SimulateUser+build"></a>

### simulateUser.build(...args) ⇒ [<code>Proxy.&lt;SimulateUser&gt;</code>](#SimulateUser)
Generate a instance using the same class constructor and debug emitter.

**Kind**: instance method of [<code>SimulateUser</code>](#SimulateUser)  

| Param | Type |
| --- | --- |
| ...args | <code>any</code> | 

<a name="SimulateUser+sleep"></a>

### simulateUser.sleep(timeout) ⇒ <code>Promise.&lt;undefined&gt;</code>
Returns a promise which resolves in a certain amount of milliseconds.

**Kind**: instance method of [<code>SimulateUser</code>](#SimulateUser)  

| Param | Type |
| --- | --- |
| timeout | <code>number</code> | 

<a name="SimulateUser+timeout"></a>

### simulateUser.timeout(func, limit) ⇒ <code>Promise.&lt;\*&gt;</code>
Returns a promise which times out if the passed in promise doesn't
resolve in time.

**Kind**: instance method of [<code>SimulateUser</code>](#SimulateUser)  

| Param | Type |
| --- | --- |
| func | <code>function</code> | 
| limit | <code>number</code> | 

<a name="SimulateUser+getEventOptions"></a>

### simulateUser.getEventOptions(options) ⇒ <code>object</code>
Get options for an event.

**Kind**: instance method of [<code>SimulateUser</code>](#SimulateUser)  

| Param | Type |
| --- | --- |
| options | <code>object</code> | 

<a name="SimulateUser+querySelectorAll"></a>

### simulateUser.querySelectorAll(query) ⇒ [<code>Array.&lt;SimulateUser&gt;</code>](#SimulateUser)
Proxy for querySelectorAll but returns an array of wrappers instead of
nodes.

**Kind**: instance method of [<code>SimulateUser</code>](#SimulateUser)  

| Param | Type |
| --- | --- |
| query | <code>string</code> \| <code>Array.&lt;string&gt;</code> | 

<a name="SimulateUser+getElementById"></a>

### simulateUser.getElementById(id) ⇒ [<code>SimulateUser</code>](#SimulateUser) \| <code>null</code>
GetElementById but returns a wrapper.

**Kind**: instance method of [<code>SimulateUser</code>](#SimulateUser)  

| Param | Type |
| --- | --- |
| id | <code>string</code> | 

<a name="SimulateUser+getElementsByName"></a>

### simulateUser.getElementsByName(name) ⇒ [<code>Array.&lt;SimulateUser&gt;</code>](#SimulateUser)
GetElementsByName but returns an array of wrappers.

**Kind**: instance method of [<code>SimulateUser</code>](#SimulateUser)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 

<a name="SimulateUser+closest"></a>

### simulateUser.closest(...args) ⇒ [<code>SimulateUser</code>](#SimulateUser) \| <code>null</code>
Closest but returns a wrapper.

**Kind**: instance method of [<code>SimulateUser</code>](#SimulateUser)  

| Param | Type |
| --- | --- |
| ...args | <code>any</code> | 

<a name="SimulateUser+all"></a>

### simulateUser.all(options) ⇒ [<code>SimulateUser</code>](#SimulateUser) \| <code>null</code>
Search through page elements as a user would, using text.

**Kind**: instance method of [<code>SimulateUser</code>](#SimulateUser)  

| Param | Type |
| --- | --- |
| options | [<code>SearchProperties</code>](#SearchProperties) | 

<a name="SimulateUser+first"></a>

### simulateUser.first(options) ⇒ [<code>SimulateUser</code>](#SimulateUser) \| <code>null</code>
Get the first element of a query to `all`.

**Kind**: instance method of [<code>SimulateUser</code>](#SimulateUser)  

| Param | Type |
| --- | --- |
| options | [<code>SearchProperties</code>](#SearchProperties) | 

<a name="SimulateUser+find"></a>

### simulateUser.find(options, limit) ⇒ [<code>SimulateUser</code>](#SimulateUser)
Get the first element of a query to `all`, but throws an error if it's
not found. Will wait for an element to appear (e.g. If a form is
updating).

**Kind**: instance method of [<code>SimulateUser</code>](#SimulateUser)  
**Throws**:

- <code>Error</code> 


| Param | Type | Description |
| --- | --- | --- |
| options | [<code>SearchProperties</code>](#SearchProperties) |  |
| [options.similar] | <code>boolean</code> | If no exact matches found, fall back to a fuzzy search. |
| limit | <code>number</code> |  |

<a name="SimulateUser+field"></a>

### simulateUser.field(label, [findOptions]) ⇒ [<code>SimulateUser</code>](#SimulateUser) \| <code>null</code>
Get a field based on its label.

**Kind**: instance method of [<code>SimulateUser</code>](#SimulateUser)  
**Throws**:

- <code>Error</code> 


| Param | Type | Default |
| --- | --- | --- |
| label | <code>string</code> |  | 
| [findOptions] | <code>object</code> | <code>{}</code> | 

<a name="SimulateUser+fieldSet"></a>

### simulateUser.fieldSet(legend) ⇒ [<code>SimulateUser</code>](#SimulateUser) \| <code>null</code>
Get a fieldset based on its legend.

**Kind**: instance method of [<code>SimulateUser</code>](#SimulateUser)  
**Throws**:

- <code>Error</code> 


| Param | Type |
| --- | --- |
| legend | <code>string</code> | 

<a name="SimulateUser+dispatchEvent"></a>

### simulateUser.dispatchEvent(event)
Proxy for dispatchEvent.

**Kind**: instance method of [<code>SimulateUser</code>](#SimulateUser)  

| Param | Type |
| --- | --- |
| event | <code>Event</code> | 

<a name="SimulateUser+click"></a>

### simulateUser.click(search)
Click this node.

**Kind**: instance method of [<code>SimulateUser</code>](#SimulateUser)  

| Param | Type | Default |
| --- | --- | --- |
| search | [<code>SearchProperties</code>](#SearchProperties) | <code></code> | 

<a name="SimulateUser+attach"></a>

### simulateUser.attach(files)
Attach files to this input element.

**Kind**: instance method of [<code>SimulateUser</code>](#SimulateUser)  

| Param | Type |
| --- | --- |
| files | <code>Array.&lt;Files&gt;</code> | 

<a name="SimulateUser+check"></a>

### simulateUser.check(checked)
Check this checkbox.

**Kind**: instance method of [<code>SimulateUser</code>](#SimulateUser)  

| Param | Type | Default |
| --- | --- | --- |
| checked | <code>boolean</code> | <code>true</code> | 

<a name="SimulateUser+focus"></a>

### simulateUser.focus()
Focus this element.

**Kind**: instance method of [<code>SimulateUser</code>](#SimulateUser)  
<a name="SimulateUser+blur"></a>

### simulateUser.blur()
Blur this element.

**Kind**: instance method of [<code>SimulateUser</code>](#SimulateUser)  
<a name="SimulateUser+typeKey"></a>

### simulateUser.typeKey(key)
Type a single key on this element.

**Kind**: instance method of [<code>SimulateUser</code>](#SimulateUser)  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 

<a name="SimulateUser+type"></a>

### simulateUser.type(text)
Type a string on this element.

**Kind**: instance method of [<code>SimulateUser</code>](#SimulateUser)  

| Param | Type |
| --- | --- |
| text | <code>string</code> | 

<a name="SimulateUser+typeValue"></a>

### simulateUser.typeValue(text)
Type into a fields value. Only simulates the final key press then
triggers a single change event.

**Kind**: instance method of [<code>SimulateUser</code>](#SimulateUser)  

| Param | Type |
| --- | --- |
| text | <code>string</code> \| <code>number</code> | 

<a name="SimulateUser+fillIn"></a>

### simulateUser.fillIn(label, value) ⇒ [<code>SimulateUser</code>](#SimulateUser)
Find a field by its label then fill it in.

**Kind**: instance method of [<code>SimulateUser</code>](#SimulateUser)  
**Returns**: [<code>SimulateUser</code>](#SimulateUser) - - The field wrapper.  

| Param | Type |
| --- | --- |
| label | <code>string</code> | 
| value | [<code>ValueSelector</code>](#ValueSelector) | 

<a name="SimulateUser+fill"></a>

### simulateUser.fill(value)
Fill in this node as a field.

**Kind**: instance method of [<code>SimulateUser</code>](#SimulateUser)  

| Param | Type |
| --- | --- |
| value | [<code>ValueSelector</code>](#ValueSelector) | 

<a name="SimulateUser+select"></a>

### simulateUser.select(value)
Change a value by the option text.

**Kind**: instance method of [<code>SimulateUser</code>](#SimulateUser)  

| Param | Type |
| --- | --- |
| value | [<code>ValueSelector</code>](#ValueSelector) | 

<a name="SimulateUser+sendChangeEvent"></a>

### simulateUser.sendChangeEvent()
Send a change event.

**Kind**: instance method of [<code>SimulateUser</code>](#SimulateUser)  
<a name="getDebugUser"></a>

## getDebugUser(Klass) ⇒ <code>object</code>
Get a debug user extending a user class.user.

**Kind**: global function  

| Param | Type |
| --- | --- |
| Klass | [<code>SimulateUser</code>](#SimulateUser) | 

<a name="get"></a>

## get(target, prop) ⇒ <code>any</code>
Get the needed property.

**Kind**: global function  

| Param | Type |
| --- | --- |
| target | <code>object</code> | 
| prop | <code>any</code> | 

<a name="SearchProperties"></a>

## SearchProperties : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | Text to search on. |
| query | <code>string</code> | Optional query to filter on. |
| caseSensitive | <code>boolean</code> | Whether text is case sensitive. |
| exact | <code>boolean</code> | Whether text match should be exact (not including trimmed white space). |
| predicate | <code>function</code> | Predicate function wrappers must match. |
| visible | <code>boolean</code> | If element must be visible or not. |
| direct | <code>boolean</code> | If text should be a direct child or not. |

<a name="ValueSelector"></a>

## ValueSelector : [<code>SearchProperties</code>](#SearchProperties) \| <code>string</code> \| <code>number</code>
A generic value selector. For a `textarea` or `input` it should always be a
string or number, for a `select` it can be a string or a `SearchProperties`.

**Kind**: global typedef  
