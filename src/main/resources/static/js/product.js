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
		const responseStatus = request.status;
		if(responseStatus === 200){
			const products = await request.json();

			this.inventory = products;	
		}
		else{
			alert("ERROR EN EL SERVIDOR: " + responseStatus);
		}
	} 

	async addProduct(product){
		const request = await fetch('api/products',{
			method: 'POST',
			headers: this.getDefaultHeaders(),
			body: JSON.stringify(product)
		});
		const responseStatus = request.status;
		if(responseStatus === 201){
			const newProduct = await request.json();
			console.log(newProduct);
			
			this.fetchProducts().then(() =>{
				this.onInventoryChanged(this.inventory);
			})
		}else{
			alert("ERROR EN EL SERVIDOR: " + responseStatus);
		}

	}

	async modifyProduct(product){
		//No funciona
		const changeProduct = (tableProduct) => {
			if(product.name === tableProduct.name){
				tableProduct = product;
			} 
			return tableProduct;
		}
		const toModifyProduct = this.inventory.map(changeProduct);
		const request = await fetch(`api/products/${toModifyProduct[0].id}`,{
			method: 'PUT',
			headers: this.getDefaultHeaders(),
			body: JSON.stringify(toModifyProduct)
		});
		const responseStatus = request.status;
		if(responseStatus === 200){
			this.fetchProducts().then(() =>{
				this.onInventoryChanged(this.inventory);
			})
		}else{
			alert("Error en el servidor con codigo: " + responseStatus);
		}

	}

	async deleteProduct(productId){
		// const toDeleteProduct =  this.inventory.filter(({name}) => name === product.name)
		const request = await fetch(`api/products/${productId}`,{
			method: 'DELETE',
			headers: this.getDefaultHeaders(),
			// body: JSON.stringify(product)
		});
		const responseStatus = request.status;
		if(responseStatus === 204){
			this.fetchProducts().then(() =>{
				this.onInventoryChanged(this.inventory);
			})
		}else{
			alert("Error en el servidor con codigo: " + responseStatus);
		}

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
            if (product.price > compareProduct.price) {
                higherPriceProduct = product;
                compareProduct = product;
            }
        }
        return higherPriceProduct.name;
	}

	getLowestPrice(){
		let compareProduct = this.inventory[0];
        let lowestPriceProduct = compareProduct;
        for (const product of this.inventory){
            if (product.price < compareProduct.price) {
                lowestPriceProduct = product;
                compareProduct = product;
            }
        }
        return lowestPriceProduct.name;
	}

	getAveragePrice(){
		let totalPrice = 0;
        for (const product of this.inventory){
            totalPrice += product.price;
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
			.append(this.addForm,this.inventoryTable,this.deleteButton,this.modifyButton,this.informButton)
		
		this.app.addEventListener("click", event => {
			const withinTable = event.composedPath().includes(this.inventoryTable);
			const withinDeleteBtn = event.composedPath().includes(this.deleteButton);
			const withinInformBtn = event.composedPath().includes(this.informButton);
			const withinModifyBtn = event.composedPath().includes(this.modifyButton);
			const withinAddBtn = event.composedPath().includes(this.addButton);
			
			if(!withinTable && !withinDeleteBtn && !withinInformBtn && !withinModifyBtn && !withinAddBtn){
				this.setSelectedProduct(null);
			}
		});

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
			if(this.getSelectedProduct()){
				handler(this.getSelectedProduct());
			}else{
				alert("Seleccione un producto!!")
			}
		})
	}

	bindInform(handler){
		this.informButton.addEventListener('click',() =>{
			handler();
		})
	}

	setSelectedProduct(row){
		this._selectedProduct = row;
	}

	getSelectedProduct(){
		return this._selectedProduct;
	}

	displayInform(inform){
		alert(inform);
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
				const nombreLink = this.createElement('a',`row-${product.id}`)
				nombreLink.setAttribute('href','#');
				nombreLink.tabIndex = -1;
				nombreLink.textContent = product.name; 
				nombre.append(nombreLink);

				const precio = this.createElement('td');
				const precioLink = this.createElement('a',`row-${product.id}`)
				precioLink.setAttribute('href','#');
				precioLink.tabIndex = -1;
				precioLink.textContent = product.price; 
				precio.append(precioLink);

				const inventario = this.createElement('td');
				const inventarioLink = this.createElement('a',`row-${product.id}`)
				inventarioLink.setAttribute('href','#');
				inventarioLink.tabIndex = -1;
				inventarioLink.textContent = product.quantity; 
				inventario.append(inventarioLink);

				tr.append(nombre,precio,inventario);

				this.inventoryTable.append(tr);

				const row = document.querySelectorAll(`.row-${product.id}`);
				row.forEach(el => el.addEventListener("click",this.setSelectedProduct.bind(this,product.id)));
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

	isProductExistById(productId) {
		const findName = ({ id }) => id === productId;
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
		if(this.isBlank(product)){
			alert("Los campos estan vacios");
			this.view.clearAddFields();
		}
			if(this.isProductExist(product.name)){
			this.model.modifyProduct(product);
		}
	}

	handleDeteleProduct = (productId) => {
		if(this.isProductExistById(productId)){
			this.model.deleteProduct(productId);
		}else{alert("El producto no se encuentra en la tabla")}
	}

	handleInform = () => {
		const inform = this.model.generateInform();
		this.view.displayInform(inform);
	}

}

const inventario = new Controller(new View, new Model);
inventario.start();