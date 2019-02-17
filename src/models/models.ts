export interface CategoryData {
	id: number;
	parent_id: number;
	order: number;
	name: string;
	slug: string;
	created_at: any;
	updated_at: any;
	image: string;
	translations: any[];
	desc: string;
}
export interface UserData {
	id: number;
	role_id: number;
	name: string;
	email: string;
	address: string;
	mobile: string;
	password: string;
	password2: string;
	avatar: string;
	created_at: any;
	updated_at: any;
	api_token: string;
	is_vip: number;
	sourdce: string;
}

export interface ProductData {
	id: number;
	title: string;
	created_at: any;
	updated_at: any;
	regular_price: any;
	sale_price: any;
	sale: number;
	in_stock: number;
	stock: number;
	sku: string;
	weight: any;
	dimensions: string;
	attributes: any;
	body: string;
	category_id: number;
	image: string;
	gallery: string;
	slug: string;
	seo_title: string;
	meta_description: string;
	meta_keywords: string;
	featured: number;
	status: string;
	category: CategoryData;
	catalog_number: string;
	translations: any[];
	product_types: ProductTypeData[];
}

export interface SliderData {
	id: number;
	image: string;
	title: string;
	product_id: number;
	created_at: any;
	updated_at: any;
	place: string;
}

export interface PaginateData {
	total: number;
	per_page: number;
	current_page: number;
	last_page: number,
	next_page_url: string;
	prev_page_url: string;
	from: number;
	to: number;
}

export interface ContactUsData {
	name: string;
	email: string;
	subject: string;
	message: string;
	updated_at: any;
	created_at: any;
	id: number;
}

export interface CartItemData {
	id: number;
	//product_id: number;
	user_id: number;
	quantity: number;
	product: ProductData;
	type: ProductTypeData;
	color: string;
}

export interface ProductTypeData {
	id: number;
	product_id: number;
	name: string;
	price: number;
	sale_price: number;
	image: string;
	extra: string;
	updated_at: any;
	created_at: any;
	is_default: number;
}

export interface OrderData {
	id: number;
	coupon: string;
	final_price: number;
	status: string;
	products: CartItemData[];
	created_at: any;
	updated_at: any;
	payment_method: string;

}

export interface CouponData {
	id: number;
	type: string;
	value: number;
	key: string;
	created_at: any;
	updated_at: any;
}
