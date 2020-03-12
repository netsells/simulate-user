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

