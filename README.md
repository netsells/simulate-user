# @netsells/simulate-user

Library for simulating user interactions using JavaScript in the browser

## Installation

```bash
yarn add git+ssh://git@github.com:netsells/simulate-user.git#master
```

## Usage

```
import SimulateUser from '@netsells/simulate-user';

const sim = new SimulateUser();

const el = await sim.find({ query: 'a', text: 'Click me' });
await el.click();
```
