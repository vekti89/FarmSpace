module.exports = function Basket(oldBasket){
    this.items = oldBasket.items || {}; 
    this.totalQty = oldBasket.totalQty || 0; 
    this.totalPrice = oldBasket.totalPrice || 0; 

    this.add = function (item, id) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = {item:item, qty:0, price:0};
        }
        storedItem.qty++;
        storedItem.price=storedItem.item.price*storedItem.qty; 
        this.totalQty++; 
        this.totalPrice += storedItem.item.price; 
    }; 
    // to output the list of items in basket
    this.generateArray = function(){
        var arr=[];
        for(let id in this.items){
            arr.push(this.items[id]);
        }
        return arr; 
    }; 
    this.reduceQty = function(id){
       this.items[id].qty--;
       this.items[id].price -= this.items[id].item.price;
       this.totalQty--;
       this.totalPrice -= this.items[id].item.price; 

       if(this.items[id].qty <=0){
           delete this.items[id]
       }
    }

    this.addQty = function(id){
        this.items[id].qty++;
        this.items[id].price += this.items[id].item.price;
        this.totalQty++;
        this.totalPrice += this.items[id].item.price; 
     }

    this.deleteItem = function(id){
        this.totalQty-=this.items[id].qty;
        this.totalPrice -= this.items[id].price; 
        delete this.items[id] 
     }

    this.emptyBasket = function(){
        this.totalQty=0; 
        this.totalPrice=0; 
        delete this.items
    }
};