import React from 'react'

interface VariantOption {
    value: string;
    price: number;
}

interface ProductVariantGroup {
    name: string;
    options: VariantOption[];
}

interface ProductVariantsProps {
    product: any;
    selectedAttributes: Record<string, string>;
    onAttributeChange: (groupName: string, value: string) => void;
    quantity: number;
    onQuantityChange?: (quantity: number) => void;
}

const ProductVariants = ({ product, selectedAttributes, onAttributeChange, quantity, onQuantityChange }: ProductVariantsProps) => {
    const variantGroups: ProductVariantGroup[] = Array.isArray(product?.variantGroups) && product.variantGroups.length > 0
        ? product.variantGroups
        : Array.isArray(product?.options) && product.options.length > 0
            ? product.options
            : [];

    const handleQuantityChange = (newQuantity: number) => {
        const safeQuantity = Math.max(1, newQuantity);
        if (onQuantityChange) {
            onQuantityChange(safeQuantity);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm text-gray-700 font-bold uppercase mb-2">Quantity:</p>
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        className="w-9 h-9 border border-gray-300 rounded-sm text-lg hover:bg-gray-100 transition-colors"
                    >
                        −
                    </button>
                    <span className="min-w-8 text-center font-medium">{quantity}</span>
                    <button
                        type="button"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="w-9 h-9 border border-gray-300 rounded-sm text-lg hover:bg-gray-100 transition-colors"
                    >
                        +
                    </button>
                </div>
            </div>

            {variantGroups.length > 0 ? (
                variantGroups.map((group) => (
                    <div key={group.name}>
                        <p className="text-sm text-gray-700 font-bold uppercase mb-2">{group.name}:</p>
                        <div className="flex flex-wrap gap-2">
                            {group.options.map((option) => {
                                const active = selectedAttributes[group.name] === option.value;
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => onAttributeChange(group.name, option.value)}
                                        className={`rounded-sm border px-4 py-2 text-sm font-medium transition ${active ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"}`}
                                    >
                                        <span>{option.value}</span>
                                        {option.price > 0 && (
                                            <span className={`ml-2 text-xs ${active ? "text-gray-200" : "text-gray-500"}`}>
                                                (Rs. {option.price.toLocaleString()})
                                            </span>
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                ))
            ) : (
                <div>
                    <p className="text-sm text-gray-700 font-bold uppercase mb-2">Options</p>
                    <p className="text-sm text-gray-600">No selectable variant groups are available for this product.</p>
                </div>
            )}
        </div>
    )
}

export default ProductVariants