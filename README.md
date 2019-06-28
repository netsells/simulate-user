[![npm version](https://badge.fury.io/js/%40netsells%2Fsimulate-user.svg)](https://badge.fury.io/js/%40netsells%2Fsimulate-user)
[![Build Status](https://travis-ci.com/netsells/simulate-user.svg?branch=master)](https://travis-ci.com/netsells/simulate-user)

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
