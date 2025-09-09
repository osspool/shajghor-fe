import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { monthsOptions, paymentOptions } from "@/lib/constants";
import { Calendar, CreditCardIcon, Filter, Search } from "lucide-react";
import { useState } from "react";

const FilterSearchTransaction = ({
  onFiltersChange,
  currentFilters,
  isPending,
}) => {
  const [localFilters, setLocalFilters] = useState(currentFilters);

  const handleSubmit = (e) => {
    e.preventDefault();
    onFiltersChange(localFilters); // Notify parent component of the filter changes
  };

  const handleFilterChange = (filterName, value) => {
    setLocalFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-wrap gap-6 justify-evenly">
        {/* Month Select Component */}
        <div className="flex items-center space-x-2 ">
          <Calendar />
          <Select
            value={localFilters.month}
            onValueChange={(value) =>
              handleFilterChange("month", parseInt(value, 10))
            }
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {monthsOptions.map((month, index) => (
                  <SelectItem key={index} value={index}>
                    {month}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Year Input Box */}

          <Input
            type="number"
            placeholder="Year"
            className="w-[80px]"
            value={localFilters.year}
            onChange={(e) => handleFilterChange("year", e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <CreditCardIcon />
          <Select
            value={localFilters.paymentMethod}
            onValueChange={(value) =>
              handleFilterChange("paymentMethod", value)
            }
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {paymentOptions.map((option, index) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Order ID Search Box */}
        <div className="flex flex-row items-center border border-gray-300 rounded-md">
          <Search className="m-2" size={20} />
          <Input
            type="text"
            className="border-none"
            value={localFilters.searchQuery}
            onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
            placeholder="Order ID in selected month"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className=" bg-blue-500 hover:bg-blue-600   "
          disabled={isPending}
        >
          <Filter className="mr-2" size={20} />
          Apply Filters
        </Button>
      </div>
    </form>
  );
};

export default FilterSearchTransaction;
