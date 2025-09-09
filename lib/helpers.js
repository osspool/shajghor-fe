// @/lib/helpers.js

export function transformCategories(categories) {
  const categoryMap = new Map();
  const rootCategories = [];

  // Initialize categoryMap with categories, setting up an empty items array for each
  categories.forEach(category => {
    categoryMap.set(category._id, { ...category, items: [] });
  });

  // Populate the items arrays and identify root categories
  categories.forEach(category => {
    const transformedCategory = categoryMap.get(category._id);
    if (category.parent) {
      const parentCategory = categoryMap.get(category.parent);
      if (parentCategory) {
        parentCategory.items.push(transformedCategory);
      }
    } else {
      rootCategories.push(transformedCategory);
    }
  });

  return rootCategories;
}


// Helper function to get status dot color
export function getPaymentStatusDotColor(status) {
  switch (status) {
    case 'completed':
      return 'bg-green-500';
    case 'pending':
      return 'bg-amber-500';
    case 'processing':
      return 'bg-blue-500';
    case 'failed':
      return 'bg-red-500';
    case 'refunded':
    case 'partially_refunded':
      return 'bg-purple-500';
    case 'cancelled':
    case 'expired':
      return 'bg-gray-500';
    default:
      return 'bg-gray-500';
  }
}

// Helper function to get status text color
export function getPaymentStatusTextColor(status) {
  switch (status) {
    case 'completed':
      return 'text-green-700';
    case 'pending':
      return 'text-amber-700';
    case 'processing':
      return 'text-blue-700';
    case 'failed':
      return 'text-red-700';
    case 'refunded':
    case 'partially_refunded':
      return 'text-purple-700';
    case 'cancelled':
    case 'expired':
      return 'text-gray-700';
    default:
      return 'text-gray-700';
  }
}




export function getPaymentStatusBadgeColor(status) {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'pending':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'processing':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'failed':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'refunded':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'cancelled':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}