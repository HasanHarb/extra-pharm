import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from "../config";
import 'rxjs/add/operator/map';

const url = Config.ApiUrl;
let cacheKey = url;


@Injectable()
export class Repo {
    header: any;
    options: any;
    constructor( public http: Http) {
        this.header = new Headers({ 'Content-Type': 'application/json' });
        this.options = new RequestOptions({ headers: this.header });
    }

    getSettings()
    {
        return this.http.get(url + 'settings', this.options).map(res => res.json());
    }

    getCities()
    {
        return this.http.get(url + 'cities', this.options).map(res => res.json());
    }

    postSubscriber(item)
    {
        return this.http.post(url + 'post/subscribe', item, this.options).map(res => res.json());
    }

    getAds(product_id = 0)
    {
        return this.http.get(url + 'ads' + (product_id ? ('/' + product_id) : '')).map(res => res.json());
    }

    refreshCartProducts(items)
    {
        return this.http.post(url + 'post/refresh-cart', {data: items}, this.options).map(res => res.json());

    }
    getPage(slug){
        return this.http.get(url + 'page/' + slug).map(res => res.json());
    }
    getAbout(){
        return this.http.get(url + 'page/' + 'about').map(res => res.json());
    }

    postContactUsMessage(item)
    {
        return this.http.post(url + 'post/contactus', item, this.options)
        .map(res => res.json());
    }

    getCategories (data = null) {
        return this.http.get(url + 'categories', {params: data}).map(res => res.json());
    }

    getHomeCategories () {
        return this.http.get(url + 'home/categories').map(res => res.json());
    }

    getCategoriesByParent (parent_id, data = null) {
        return this.http.get(url + 'categories/' + parent_id, {params: data}).map(res => res.json());
    }

    getProducts (data) {
        return this.http.get(url + 'products', {params: data}).map(res => {
            let products = res.json();
            products.data.forEach(product => {
                product.image = Config.StorageUrl + product.image
            });

            return products;
        });
    }
    getTopProducts(){
        return this.http.get(url + 'products-groups').map(res => {
            let response = res.json();
            for(var type in response){
                response[type].forEach(product => {
                    product.image = Config.StorageUrl + product.image
                });
            }
            return response;
        });
    }

    getCategoriezedProducts(){
        return this.http.get(url + 'categorized-products').map(res => {
            let _res = res.json();
            _res.forEach(item => {
                item.products.forEach(product => {
                    product.image = Config.StorageUrl + product.image
                });
            });
            return _res;
        });
    }

    getCategory(data){
        return this.http.get(url + 'category-details', {params: data} ).map(res => {
          let result = res.json();
          if(result.banner) result.banner = Config.StorageUrl + result.banner;
          return result;
        });
    }

    getEmail(data)
    {
        return this.http.get(url + 'email', {params: data}).map(res => res.json());
    }

    getProduct(id){
        return this.http.get(url + 'products/' + id).map(res => res.json());
    }

    getTopTen () {
        return this.http.get(url + 'topProducts').map(res => {
            let products = res.json();
            products.data.forEach(product => {
                product.image = Config.StorageUrl + product.image
            });

            return products;
        });
    }

    getSliders (data) {
        return this.http.get(url + 'sliders', {params: data}).map(res => {
            let slides = res.json();
            slides.data.forEach(slide => {
                slide.image = Config.StorageUrl + slide.image
            });

            return slides;
        });
    }

    getCenterBanners(data) {
        return this.http.get(url + 'banners', {params: data}).map(res => {
            let banners = res.json();
            banners.forEach(banner => {
                banner.image = banner.image != null ? Config.StorageUrl + banner.image : null;
            });

            return banners;
        });
    }

    register(item) {
        return this.http.post(url + 'post/register', item, this.options)
            .map(res => res.json());
    }

    login(item) {
        return this.http.post(url + 'post/login', item, this.options)
            .map(res => res.json());
    }

    loginFB(item) {
        return this.http.post(url + 'post/login-fb', item, this.options)
            .map(res => res.json());
    }

    logout() {
        localStorage.api_token = null;
    }

    getUserData()
    {
        return this.http.get(url + 'user?api_token=' + localStorage.api_token).map(res => res.json());
    }

    updateMyProfile(item) {
        return this.http.put(url + 'myprofile?api_token=' + localStorage.api_token, item, this.options)
            .map(res => res.json());
    }

    resetPassword(item)
    {
        return this.http.post(url + 'password/email', item, this.options)
        .map(res => res.json());
    }

    isLoggedIn(): any {
        return localStorage.api_token ? true : false;
/*
        if (localStorage.api_token != "null" && localStorage.api_token != "undefined")
        {
            this.getUserData().subscribe(data => {
                if(data.id == null)
                return false;
                else
                return true;
            },
            err=>
            {
                return false;
            });
        }
        else return false;*/
    }

    checkCoupon(item) {
        return this.http.get(url + 'coupons/' + item).map(res => res.json());
    }

    placeOrder(item) {
        return this.http.post(url + 'placeorder?api_token=' + localStorage.api_token, item, this.options)
            .map(res => res.json());
    }

    getMyOrders(params) {
        return this.http.get(url + 'myorders', { params: params }).map(res => res.json());
    }

    getOrderInfo(id) {
        let type = 1;
        return this.http.get(url + 'myorders/' + id, { params: { api_token: localStorage.api_token,type } }).map(res => res.json());
    }

    getProductTypes(params){
        return this.http.get(url + 'products/types', {params: params}).map(res => res.json());
    }

    getLanguages(){
        return this.http.get(url + 'languages').map(res => res.json());
    }

    getAttributes(categorySlug: any){
        return this.http.get(url + 'groups', {params: {categorySlug: categorySlug, isFilter: 1}}).map(res => res.json());
    }

    payWithTranzila(data:any){
        return this.http.post(url + 'post/pay/tranzila', {data: data}).map(res => res.json());
    }

}
