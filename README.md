[![npm version](https://badge.fury.io/js/%40netsells%2Fsimulate-user.svg)](https://badge.fury.io/js/%40netsells%2Fsimulate-user)
[![Build Status](https://travis-ci.org/netsells/simulate-user.svg?branch=master)](https://travis-ci.org/netsells/simulate-user)

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

## Members

<dl>
<dt><a href="#visible">visible</a> ⇒ <code>Boolean</code></dt>
<dd><p>Check if the node is visible</p>
</dd>
<dt><a href="#hidden">hidden</a> ⇒ <code>Boolean</code></dt>
<dd><p>Check if the node is hidden</p>
</dd>
<dt><a href="#nextElementSibling">nextElementSibling</a> ⇒ <code>SimulateUser</code> | <code>null</code></dt>
<dd><p>nextElementSibling but returns a wrapper</p>
</dd>
<dt><a href="#options">options</a> ⇒ <code>Array.&lt;String&gt;</code></dt>
<dd><p>Get all select option values</p>
</dd>
<dt><a href="#text">text</a> ⇒ <code>String</code></dt>
<dd><p>Get trimmed text content</p>
</dd>
<dt><a href="#value">value</a> ⇒ <code>String</code></dt>
<dd><p>Proxy for value</p>
</dd>
<dt><a href="#htmlFor">htmlFor</a> ⇒ <code>String</code></dt>
<dd><p>Proxy for htmlFor</p>
</dd>
<dt><a href="#tag">tag</a> ⇒ <code>String</code></dt>
<dd><p>tagName but lower case</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#build">build()</a> ⇒ <code>SimulateUser</code></dt>
<dd><p>Generate a instance using the same class constructor</p>
</dd>
<dt><a href="#log">log()</a></dt>
<dd><p>Proxy for console.log</p>
</dd>
<dt><a href="#error">error()</a></dt>
<dd><p>Proxy for console.error</p>
</dd>
<dt><a href="#sleep">sleep(timeout)</a> ⇒ <code>Promise.&lt;undefined&gt;</code></dt>
<dd><p>Returns a promise which resolves in a certain amount of milliseconds</p>
</dd>
<dt><a href="#timeout">timeout(func, limit)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd><p>Returns a promise which times out if the passed in promise doesn&#39;t
resolve in time</p>
</dd>
<dt><a href="#getEventOptions">getEventOptions(options)</a> ⇒ <code>Object</code></dt>
<dd><p>Get options for an event</p>
</dd>
<dt><a href="#querySelectorAll">querySelectorAll(query)</a> ⇒ <code>Array.&lt;SimulateUser&gt;</code></dt>
<dd><p>Proxy for querySelectorAll but returns an array of wrappers instead of
nods</p>
</dd>
<dt><a href="#getElementById">getElementById(id)</a> ⇒ <code>SimulateUser</code> | <code>null</code></dt>
<dd><p>getElementById but returns a wrapper</p>
</dd>
<dt><a href="#getElementsByName">getElementsByName(name)</a> ⇒ <code>Array.&lt;SimulateUser&gt;</code></dt>
<dd><p>getElementsByName but returns an array of wrappers</p>
</dd>
<dt><a href="#closest">closest()</a> ⇒ <code>SimulateUser</code> | <code>null</code></dt>
<dd><p>closest but returns a wrapper</p>
</dd>
<dt><a href="#all">all(options)</a> ⇒ <code>SimulateUser</code> | <code>null</code></dt>
<dd><p>Search through page elements as a user would, using text</p>
</dd>
<dt><a href="#first">first(options)</a> ⇒ <code>SimulateUser</code> | <code>null</code></dt>
<dd><p>Get the first element of a query to <code>all</code></p>
</dd>
<dt><a href="#find">find(options, limit)</a> ⇒ <code>SimulateUser</code></dt>
<dd><p>Get the first element of a query to <code>all</code>, but throws an error if it&#39;s
not found. Will wait for an element to appear (e.g. if a form is
updating)</p>
</dd>
<dt><a href="#field">field(label)</a> ⇒ <code>SimulateUser</code> | <code>null</code></dt>
<dd><p>Get a field based on its label</p>
</dd>
<dt><a href="#fieldSet">fieldSet(legend)</a> ⇒ <code>SimulateUser</code> | <code>null</code></dt>
<dd><p>Get a fieldset based on its legend</p>
</dd>
<dt><a href="#dispatchEvent">dispatchEvent(event)</a></dt>
<dd><p>Proxy for dispatchEvent</p>
</dd>
<dt><a href="#click">click()</a></dt>
<dd><p>Click this node</p>
</dd>
<dt><a href="#attach">attach(files)</a></dt>
<dd><p>Attach files to this input element</p>
</dd>
<dt><a href="#check">check(checked)</a></dt>
<dd><p>Check this checkbox</p>
</dd>
<dt><a href="#focus">focus()</a></dt>
<dd><p>Focus this element</p>
</dd>
<dt><a href="#blur">blur()</a></dt>
<dd><p>Blur this element</p>
</dd>
<dt><a href="#typeKey">typeKey(key)</a></dt>
<dd><p>Type a single key on this element</p>
</dd>
<dt><a href="#type">type(text)</a></dt>
<dd><p>Type a string on this element</p>
</dd>
<dt><a href="#typeValue">typeValue(text)</a></dt>
<dd><p>Type into a fields value. Only simulates the final key press then
triggers a single change event</p>
</dd>
<dt><a href="#fillIn">fillIn(label, value)</a> ⇒ <code>SimulateUser</code></dt>
<dd><p>Find a field by its label then fill it in</p>
</dd>
<dt><a href="#fill">fill(text)</a></dt>
<dd><p>Fill in this node as a field</p>
</dd>
<dt><a href="#fillSelect">fillSelect(label, text, options)</a> ⇒ <code>SimulateUser</code></dt>
<dd><p>Find a select by its label then fill it in</p>
</dd>
<dt><a href="#select">select(options)</a></dt>
<dd><p>Change a value by the option text</p>
</dd>
<dt><a href="#sendChangeEvent">sendChangeEvent()</a></dt>
<dd><p>Send a change event</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#SearchProperties">SearchProperties</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="visible"></a>

## visible ⇒ <code>Boolean</code>
Check if the node is visible

**Kind**: global variable  
<a name="hidden"></a>

## hidden ⇒ <code>Boolean</code>
Check if the node is hidden

**Kind**: global variable  
<a name="nextElementSibling"></a>

## nextElementSibling ⇒ <code>SimulateUser</code> \| <code>null</code>
nextElementSibling but returns a wrapper

**Kind**: global variable  
<a name="options"></a>

## options ⇒ <code>Array.&lt;String&gt;</code>
Get all select option values

**Kind**: global variable  
<a name="text"></a>

## text ⇒ <code>String</code>
Get trimmed text content

**Kind**: global variable  
<a name="value"></a>

## value ⇒ <code>String</code>
Proxy for value

**Kind**: global variable  
<a name="htmlFor"></a>

## htmlFor ⇒ <code>String</code>
Proxy for htmlFor

**Kind**: global variable  
<a name="tag"></a>

## tag ⇒ <code>String</code>
tagName but lower case

**Kind**: global variable  
<a name="build"></a>

## build() ⇒ <code>SimulateUser</code>
Generate a instance using the same class constructor

**Kind**: global function  

| Param | Type |
| --- | --- |
| ...args | <code>\*</code> | 

<a name="log"></a>

## log()
Proxy for console.log

**Kind**: global function  

| Param | Type |
| --- | --- |
| ...args | <code>\*</code> | 

<a name="error"></a>

## error()
Proxy for console.error

**Kind**: global function  

| Param | Type |
| --- | --- |
| ...args | <code>\*</code> | 

<a name="sleep"></a>

## sleep(timeout) ⇒ <code>Promise.&lt;undefined&gt;</code>
Returns a promise which resolves in a certain amount of milliseconds

**Kind**: global function  

| Param | Type |
| --- | --- |
| timeout | <code>Number</code> | 

<a name="timeout"></a>

## timeout(func, limit) ⇒ <code>Promise.&lt;\*&gt;</code>
Returns a promise which times out if the passed in promise doesn't
resolve in time

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| func | <code>function</code> |  | 
| limit | <code>Number</code> | <code>2000</code> | 

<a name="getEventOptions"></a>

## getEventOptions(options) ⇒ <code>Object</code>
Get options for an event

**Kind**: global function  

| Param | Type |
| --- | --- |
| options | <code>Object</code> | 

<a name="querySelectorAll"></a>

## querySelectorAll(query) ⇒ <code>Array.&lt;SimulateUser&gt;</code>
Proxy for querySelectorAll but returns an array of wrappers instead of
nods

**Kind**: global function  

| Param | Type |
| --- | --- |
| query | <code>String</code> \| <code>Array.&lt;String&gt;</code> | 

<a name="getElementById"></a>

## getElementById(id) ⇒ <code>SimulateUser</code> \| <code>null</code>
getElementById but returns a wrapper

**Kind**: global function  

| Param | Type |
| --- | --- |
| id | <code>String</code> | 

<a name="getElementsByName"></a>

## getElementsByName(name) ⇒ <code>Array.&lt;SimulateUser&gt;</code>
getElementsByName but returns an array of wrappers

**Kind**: global function  

| Param | Type |
| --- | --- |
| name | <code>String</code> | 

<a name="closest"></a>

## closest() ⇒ <code>SimulateUser</code> \| <code>null</code>
closest but returns a wrapper

**Kind**: global function  

| Param | Type |
| --- | --- |
| ...args | <code>\*</code> | 

<a name="all"></a>

## all(options) ⇒ <code>SimulateUser</code> \| <code>null</code>
Search through page elements as a user would, using text

**Kind**: global function  

| Param | Type |
| --- | --- |
| options | [<code>SearchProperties</code>](#SearchProperties) | 

<a name="first"></a>

## first(options) ⇒ <code>SimulateUser</code> \| <code>null</code>
Get the first element of a query to `all`

**Kind**: global function  

| Param | Type |
| --- | --- |
| options | [<code>SearchProperties</code>](#SearchProperties) | 

<a name="find"></a>

## find(options, limit) ⇒ <code>SimulateUser</code>
Get the first element of a query to `all`, but throws an error if it's
not found. Will wait for an element to appear (e.g. if a form is
updating)

**Kind**: global function  
**Throws**:

- <code>Error</code> 


| Param | Type | Description |
| --- | --- | --- |
| options | [<code>SearchProperties</code>](#SearchProperties) |  |
| [options.similar] | <code>Boolean</code> | If no exact matches found, fall back to a fuzzy search |
| limit | <code>Number</code> |  |

<a name="field"></a>

## field(label) ⇒ <code>SimulateUser</code> \| <code>null</code>
Get a field based on its label

**Kind**: global function  
**Throws**:

- <code>Error</code> 


| Param | Type |
| --- | --- |
| label | <code>String</code> | 

<a name="fieldSet"></a>

## fieldSet(legend) ⇒ <code>SimulateUser</code> \| <code>null</code>
Get a fieldset based on its legend

**Kind**: global function  
**Throws**:

- <code>Error</code> 


| Param | Type |
| --- | --- |
| legend | <code>String</code> | 

<a name="dispatchEvent"></a>

## dispatchEvent(event)
Proxy for dispatchEvent

**Kind**: global function  

| Param | Type |
| --- | --- |
| event | <code>Event</code> | 

<a name="click"></a>

## click()
Click this node

**Kind**: global function  
<a name="attach"></a>

## attach(files)
Attach files to this input element

**Kind**: global function  

| Param | Type |
| --- | --- |
| files | <code>Enumerable.&lt;Files&gt;</code> | 

<a name="check"></a>

## check(checked)
Check this checkbox

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| checked | <code>Boolean</code> | <code>true</code> | 

<a name="focus"></a>

## focus()
Focus this element

**Kind**: global function  
<a name="blur"></a>

## blur()
Blur this element

**Kind**: global function  
<a name="typeKey"></a>

## typeKey(key)
Type a single key on this element

**Kind**: global function  

| Param | Type |
| --- | --- |
| key | <code>String</code> | 

<a name="type"></a>

## type(text)
Type a string on this element

**Kind**: global function  

| Param | Type |
| --- | --- |
| text | <code>String</code> | 

<a name="typeValue"></a>

## typeValue(text)
Type into a fields value. Only simulates the final key press then
triggers a single change event

**Kind**: global function  

| Param | Type |
| --- | --- |
| text | <code>String</code> | 

<a name="fillIn"></a>

## fillIn(label, value) ⇒ <code>SimulateUser</code>
Find a field by its label then fill it in

**Kind**: global function  
**Returns**: <code>SimulateUser</code> - - The field wrapper  

| Param | Type |
| --- | --- |
| label | <code>String</code> | 
| value | <code>String</code> | 

<a name="fill"></a>

## fill(text)
Fill in this node as a field

**Kind**: global function  

| Param | Type |
| --- | --- |
| text | <code>String</code> | 

<a name="fillSelect"></a>

## fillSelect(label, text, options) ⇒ <code>SimulateUser</code>
Find a select by its label then fill it in

**Kind**: global function  
**Returns**: <code>SimulateUser</code> - - The field wrapper  

| Param | Type |
| --- | --- |
| label | <code>String</code> | 
| text | <code>String</code> | 
| options | <code>Object</code> | 

<a name="select"></a>

## select(options)
Change a value by the option text

**Kind**: global function  

| Param | Type |
| --- | --- |
| options | <code>Object</code> | 

<a name="sendChangeEvent"></a>

## sendChangeEvent()
Send a change event

**Kind**: global function  
<a name="SearchProperties"></a>

## SearchProperties : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| text | <code>String</code> | Text to search on |
| query | <code>String</code> | Optional query to filter on |
| caseSensitive | <code>Boolean</code> | Whether text is case sensitive |
| exact | <code>Boolean</code> | Whether text match should be exact (not including trimmed white space) |
| predicate | <code>function</code> | Predicate function wrappers must match |
| visible | <code>function</code> | If element must be visible or not |

