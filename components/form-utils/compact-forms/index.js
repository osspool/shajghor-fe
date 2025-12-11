// components/form-utils/compact-forms/index.js
/**
 * Compact Form Components
 * 
 * A collection of space-efficient form components designed for compact UIs like POS systems,
 * mobile views, or any interface where space is at a premium.
 * 
 * Features:
 * - Floating label design for better space utilization
 * - Consistent styling and behavior
 * - Form integration support (react-hook-form)
 * - Direct usage without forms
 * - Comprehensive error handling
 * - Accessibility compliant
 * 
 * @module compact-forms
 */

// Form Input Components
export { default as CompactInput } from './compact-input';
export { default as CompactSelect } from './compact-select';
export { default as CompactNumberInput } from './compact-number-input';
export { default as CompactDateRangePicker } from './compact-date-range-picker';
export { default as CompactTagChoice } from './compact-tag-choice';
export * as Field from './field';

// Display Components
export {
  InfoDisplay,
  CompactItemCard,
  CompactSection,
  QuantityControl
} from './compact-display';

// Re-export all components as a namespace for convenience
import CompactInput from './compact-input';
import CompactSelect from './compact-select';
import CompactNumberInput from './compact-number-input';
import CompactDateRangePicker from './compact-date-range-picker';
import CompactTagChoice from './compact-tag-choice';
import * as Field from './field';
import {
  InfoDisplay,
  CompactItemCard,
  CompactSection,
  QuantityControl
} from './compact-display';

const CompactForms = {
  Input: CompactInput,
  Select: CompactSelect,
  NumberInput: CompactNumberInput,
  DateRangePicker: CompactDateRangePicker,
  TagChoice: CompactTagChoice,
  InfoDisplay,
  ItemCard: CompactItemCard,
  Section: CompactSection,
  QuantityControl
};

export default CompactForms;
