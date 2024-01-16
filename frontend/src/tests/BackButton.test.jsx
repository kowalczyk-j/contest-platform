/**
 * @jest-environment jsdom
 */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */


import React from 'react';
import { render } from '@testing-library/react';
import BackButton from '../components/BackButton';

test('renders Component1 without crashing', () => {
  render(<BackButton />);
});