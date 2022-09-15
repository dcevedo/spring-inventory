'use strict';
class Model{
    constructor(){
		this.inventory=[
			{nombre: "Manzanas", precio:5000.0, inventario: 25},
			{nombre: "Limones", precio:2300.0, inventario: 15},
			{nombre: "Peras", precio:2700.0, inventario: 33},
			{nombre: "Arandanos", precio:9300.0, inventario: 5},
			{nombre: "Tomates", precio:2100.0, inventario: 42},
			{nombre: "Fresas", precio:4100.0, inventario: 3},
			{nombre: "Helado", precio:4500.0, inventario: 41},
			{nombre: "Galletas", precio:500.0, inventario: 8},
			{nombre: "Chocolates", precio:3500.0, inventario: 25},
			{nombre: "Jamon", precio:15000.0, inventario: 25},
		]
    }

	addProduct(product){
		this.inventory.push(product);
		this.onInventoryChanged(this.inventory);
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
		this.app = this.getElement('#root');
		this.title = this.createElement('h1');
		this.title.textContent = 'Inventario de productos';

		this.form = this.createElement('form');
		
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

		this.form
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
		.append(this.form,this.inventoryTable,this.deleteButton,this.modifyButton,this.informButton);
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
		this.form.addEventListener('submit', event =>{
			event.preventDefault();

			const nombre = this._productAddValue;
			const precio = this._priceAddValue;
			const inventario = this._inventoryAddValue;
			
			const product = {nombre:nombre, precio:precio, inventario:inventario};
			handler(product);
		})
	}

	bindModifyProduct(handler){
		this.modifyButton.addEventListener('click',() => {
			const nombre = this._productAddValue;
			const precio = this._priceAddValue;
			const inventario = this._inventoryAddValue;
			
			const product = {nombre:nombre, precio:precio, inventario:inventario};
			handler(product);
		})
	}

	bindDeleteProduct(handler){
		this.deleteButton.addEventListener('click',() => {
			const nombre = this._productAddValue;
			const precio = this._priceAddValue;
			const inventario = this._inventoryAddValue;
			
			const product = {nombre:nombre, precio:precio, inventario:inventario};
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
				tr.id = product.nombre;

				const nombre = this.createElement('td');
				nombre.textContent = product.nombre;

				const precio = this.createElement('td');
				precio.textContent = product.precio;

				const inventario = this.createElement('td');
				inventario.textContent = product.inventario

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
		this.onInventoryChanged(this.model.inventory);
		this.model.bindInventoryChanged(this.onInventoryChanged);

		this.view.bindAddProduct(this.handleAddProduct);
		this.view.bindModifyProduct(this.handleModifyProduct);
		this.view.bindDeleteProduct(this.handleDeteleProduct);
		this.view.bindInform(this.handleInform);    
	}

	start(){
		this.view.displayInventory(this.model.inventory);
	}

	onInventoryChanged = (inventory) => {
		this.view.displayInventory(inventory);
	}

	verifyProduct(nuevoNombre) {
		const encuentraNombre = ({ nombre }) => nombre === nuevoNombre;
        const existeNombre = this.model.inventory.some(encuentraNombre);
        return existeNombre;
	}

	handleAddProduct = (product) => {
		if (!this.verifyProduct(product.nombre)){
			this.model.addProduct(product);
		}
	}

	handleModifyProduct = (product) =>{
		if(this.verifyProduct(product.nombre)){
			this.model.modifyProduct(product);
		}
	}

	handleDeteleProduct = (product) => {
		if(this.verifyProduct(product.nombre)){
			this.model.deleteProduct(product);
		}
	}

	handleInform = () => {
		const inform = this.model.generateInform();
		this.view.displayInform(inform);
	}

}

const inventario = new Controller(new View, new Model);
inventario.start();