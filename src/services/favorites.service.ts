import { Injectable } from '@angular/core'; 

@Injectable()
export class Favorites{
    fav:any[];
    constructor(){
        this.fav = localStorage.extraPharmFavs ? JSON.parse(localStorage.extraPharmFavs) : [];
    }

    toggle(product: any){
        var index = this.fav.findIndex(x =>x.id == product.id);
        if(index == -1 && product.id != null){
            this.fav.push(product);
        } else {
            this.fav.splice(index, 1)
        }
        this.saveFav();
    }

    getFav(){
        return this.fav;
    }

    inFav(product){
        var index = this.fav.findIndex(x =>x.id == product.id);
        return index == -1 ? false : true;
    }

    saveFav(){
        localStorage.extraPharmFavs = JSON.stringify(this.fav);
    }
}