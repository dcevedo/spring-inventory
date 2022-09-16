'use strict';
class Model{
  constructor(){}
	
	getDefaultHeaders(){
		return {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			// 'Authorization': localStorage.token,
		  }
	}

	async fetchProducts() {
		const request = await fetch('api/products',{
			method: 'GET',
			headers: this.getDefaultHeaders(),
		});
		const products = await request.json();
		this.inventory = products;
	} 

	async addProduct(product){
		const request = await fetch('api/products',{
			method: 'POST',
			headers: this.getDefaultHeaders(),
			body: JSON.stringify(product)
		});
		const newProduct = await request.json();
		console.log(newProduct);
		this.fetchProducts().then(() =>{
			this.onInventoryChanged(this.inventory);
		})
	}

	modifyProduct(product){
		const changeProduct = (tableProduct) => {
			if(product.nombre === tableProduct.nombre){
				tableProduct = product;
			} 
			return tableProduct;
		}
		this.inventory = this.inventory.map(changeProduct);
		this.onInventoryChanged(this.inventory);	
	}

	deleteProduct(product){
		this.inventory =  this.inventory.filter(({nombre}) => nombre !== product.nombre)
		this.onInventoryChanged(this.inventory);
	}

	generateInform(){
		const higher = this.getHigherPrice();
		const lowest = this.getLowestPrice();
		const average = this.getAveragePrice();

		const inform = `${higher} ${lowest} ${average}`
		return inform;
	}

	getHigherPrice(){
		let compareProduct = this.inventory[0];
        let higherPriceProduct = compareProduct;
        for (const product of this.inventory){
            if (product.precio > compareProduct.precio) {
                higherPriceProduct = product;
                compareProduct = product;
            }
        }
        return higherPriceProduct.nombre;
	}

	getLowestPrice(){
		let compareProduct = this.inventory[0];
        let lowestPriceProduct = compareProduct;
        for (const product of this.inventory){
            if (product.precio < compareProduct.precio) {
                lowestPriceProduct = product;
                compareProduct = product;
            }
        }
        return lowestPriceProduct.nombre;
	}

	getAveragePrice(){
		let totalPrice = 0;
        for (const product of this.inventory){
            totalPrice += product.precio;
        }
        const averagePrice = (totalPrice / this.inventory.length).toFixed(1);
        return averagePrice;
	}


	bindInventoryChanged(callback){
		this.onInventoryChanged = callback;
	}

}
class View{
    constructor(){
    }
	createElement(tag,className){
		const element = document.createElement(tag);
		if(className)element.classList.add(className); 
		return element;
	}

	getElement(selector){
		const element = document.querySelector(selector);
		return element;
	}

	getView(){
		
		this.app = this.getElement('#root');
		this.title = this.createElement('h1');
		this.title.textContent = 'Inventario de productos';

		this.addForm = this.createElement('form');
		
		this.productAddField = this.createElement('input');
		this.productAddField.type = 'text';
		this.productAddField.placeholder = 'Producto...';

		this.priceAddField = this.createElement('input');
		this.priceAddField.type = 'text';
		this.priceAddField.placeholder = 'valor...';

		this.inventoryAddField = this.createElement('input');
		this.inventoryAddField.type = 'text';
		this.inventoryAddField.placeholder = 'inventario...';

		this.addButton = this.createElement('button');
		this.addButton.textContent = 'Agregar Producto';

		this.addForm
		.append(this.productAddField,this.priceAddField,this.inventoryAddField,this.addButton);

		this.inventoryTable = this.createElement('table','inventory-table');
		this.firstRow = this.createElement('tr');

		this.firstHeadTable = this.createElement('th');
		this.firstHeadTable.textContent = 'Producto';

		this.secondHeadTable = this.createElement('th');
		this.secondHeadTable.textContent = 'Valor'

		this.thirdHeadTable = this.createElement('th');
		this.thirdHeadTable.textContent = 'Inventario'
		
		this.firstRow.append(this.firstHeadTable,this.secondHeadTable,this.thirdHeadTable);
		this.inventoryTable.append(this.firstRow);
		
		this.deleteButton =this.createElement('button');
		this.deleteButton.textContent = 'Eliminar Producto';

		this.modifyButton = this.createElement('button');
		this.modifyButton.textContent = 'Actualizar producto';

		this.informButton = this.createElement('button');
		this.informButton.textContent = 'Informe';

		this.app
		.append(this.addForm,this.inventoryTable,this.deleteButton,this.modifyButton,this.informButton);
	}
	clearAddFields(){
		this.productAddField.value="";
		this.priceAddField.value="";
		this.inventoryAddField.value="";
	}

	get _productAddValue(){
		return this.productAddField.value
	}

	get _priceAddValue(){
		return this.priceAddField.value
	}

	get _inventoryAddValue(){
		return this.inventoryAddField.value
	}

	bindAddProduct(handler){
		this.addForm.addEventListener('submit', event =>{
			event.preventDefault();
			
			const nombre = this._productAddValue;
			const precio = this._priceAddValue;
			const inventario = this._inventoryAddValue;
			
			const product = {name:nombre, price:precio, quantity:inventario};
			handler(product);
		})
	}

	bindModifyProduct(handler){
		this.modifyButton.addEventListener('click',() => {
			const nombre = this._productAddValue;
			const precio = this._priceAddValue;
			const inventario = this._inventoryAddValue;
			
			const product = {name:nombre, price:precio, quantity:inventario};
			handler(product);
		})
	}

	bindDeleteProduct(handler){
		this.deleteButton.addEventListener('click',() => {
			const nombre = this._productAddValue;
			const precio = this._priceAddValue;
			const inventario = this._inventoryAddValue;
			
			const product = {name:nombre, price:precio, quantity:inventario};
			handler(product);
		})
	}

	bindInform(handler){
		this.informButton.addEventListener('click',() =>{
			handler();
		})
	}

	displayInform(inform){
		console.log(inform);
	}

	displayInventory(inventory){
		if(this.inventoryTable.hasChildNodes()){
			let children = this.inventoryTable.childNodes;
			for(let i = children.length; i>1 ; i--){
				this.inventoryTable.removeChild(children[i-1]);
			}
		}
		if(inventory.length === 0){
			console.log("sin elementos");	
		}
		else{
			inventory.forEach( product =>{
				const tr = this.createElement('tr');
				tr.id = product.id;

				const nombre = this.createElement('td');
				nombre.textContent = product.name;

				const precio = this.createElement('td');
				precio.textContent = product.price;

				const inventario = this.createElement('td');
				inventario.textContent = product.quantity

				tr.append(nombre,precio,inventario);
				this.inventoryTable.append(tr);
			})
		}
	}

}
class Controller{
  constructor(view,model){
    	this.view = view;
		this.model = model;  
	}

	start(){
		this.view.getView();
		this.model.fetchProducts().then(() => {
			this.view.displayInventory(this.model.inventory);
			this.onInventoryChanged(this.model.inventory);
		})
		this.model.bindInventoryChanged(this.onInventoryChanged);
		this.view.bindAddProduct(this.handleAddProduct);
		this.view.bindModifyProduct(this.handleModifyProduct);
		this.view.bindDeleteProduct(this.handleDeteleProduct);
		this.view.bindInform(this.handleInform);  
	}

	onInventoryChanged = (inventory) => {
		this.view.displayInventory(inventory);
	}

	isProductExist(newProductName) {
		const findName = ({ name }) => name === newProductName;
        const isExist = this.model.inventory.some(findName);
        return isExist;
	}

	isBlank(product){
		for (const [key,value] of Object.entries(product)) {
			if( value.trim().length === 0){
				return true;
			}			
		}
	}

	checkLetters(string){
		return /^[a-zA-Z]+$/.test(string);
	}

	isTypes(product){
		let msg;
		const isTypeName = (this.checkLetters(product.name));
		if(!isTypeName){ msg = "En el campo nombre solo pueden ir palabras";}

		const isTypePrice = !isNaN(Number.parseFloat(product.price).toFixed(1));
		if(!isTypePrice){ msg = "En el campo precio solo pueden ir numeros";}

		const isTypeQuantity = !isNaN(Number.parseInt(product.quantity));
		if(!isTypeQuantity){ msg = "En el campo cantidad solo pueden ir numeros";}
		
		// const isTypes = [isTypeName,isTypePrice,isTypeQuantity];
		// const varToString = varObj => Object.keys(varObj)[0];
		// const Type = varToString(isTypes.find((element) => element === false));
		if(isTypeName && isTypePrice && isTypeQuantity){
		// if(Type){
			return {
				result : true,
 			};
		}else{
			return {
				result : false,
				msg : msg,
			};
		}

	}

	handleAddProduct = (product) => {
		if(this.isBlank(product)){
			alert("Los campos estan vacios");
			this.view.clearAddFields();
		}
		else if(!this.isTypes(product).result){
			alert(this.isTypes(product).msg)
			this.view.clearAddFields();
		}
		else if (!this.isProductExist(product.name)){
			this.model.addProduct(product);
		}else{alert("El producto ya se encuentra en la tabla")}
	}

	handleModifyProduct = (product) =>{
		if(this.isBlank(product)) alert("Los campos estan vacios");
		if(this.isProductExist(product.nombre)){
			this.model.modifyProduct(product);
		}
	}

	handleDeteleProduct = (product) => {
		// if(this.isBlank(product)) alert("Los campos estan vacios");
		if(this.isProductExist(product.nombre)){
			this.model.deleteProduct(product);
		}else{alert("El producto no se encuentra en la tabla")}
	}

	handleInform = () => {
		const inform = this.model.generateInform();
		this.view.displayInform(inform);
	}

}

const inventario = new Controller(new View, new Model);
inventario.start();