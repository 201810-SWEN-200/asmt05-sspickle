import React from 'react';
import './App.css';

type ProductType = {stocked:boolean, price:string, name:string, category:string}

class ProductCategoryRow extends React.Component<{category:string}> {
  render() {
    const {category} = this.props
    return (
      <tr>
        <th colSpan={2}>
          {category}
        </th>
      </tr>
    );
  }
}

class ProductRow extends React.Component<{product:ProductType}> {
  render() {
    const product = this.props.product;
    const name = product.stocked ?
      product.name :
      <span style={{color: 'red'}}>
        {product.name}
      </span>;

    return (
      <tr>
        <td>{name}</td>
        <td>{product.price}</td>
      </tr>
    );
  }
}

class ProductTable extends React.Component <{filterText:string, inStockOnly:boolean, products:ProductType[]}>{
  render() {
    const filterText = this.props.filterText;
    const inStockOnly = this.props.inStockOnly;

    const rows: any[] = [];
    let lastCategory: string | null = null;

    this.props.products.forEach((product) => {
      if (product.name.indexOf(filterText) === -1) {
        return;
      }
      if (inStockOnly && !product.stocked) {
        return;
      }
      if (product.category !== lastCategory) {
        rows.push(
          <ProductCategoryRow
            category={product.category}
            key={product.category} />
        );
      }
      rows.push(
        <ProductRow
          product={product}
          key={product.name}
        />
      );
      lastCategory = product.category;
    });

    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

class SearchBar extends React.Component <{onFilterTextChange:(value:string)=>void, onInStockChange:(value:boolean)=>void, filterText:string, inStockOnly:boolean}>  {
  constructor(props:{onFilterTextChange:(value:string)=>void, onInStockChange:(value:boolean)=>void, filterText:string, inStockOnly:boolean}) {
    super(props);
    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    this.handleInStockChange = this.handleInStockChange.bind(this);
  }
  
  handleFilterTextChange(e:React.ChangeEvent<HTMLInputElement>) {
    this.props.onFilterTextChange(e.target.value);
  }
  
  handleInStockChange(e:React.ChangeEvent<HTMLInputElement>) {
    this.props.onInStockChange(e.target.checked);
  }
  
  render() {
    return (
      <form>
        <input
          type="text"
          placeholder="Search..."
          value={this.props.filterText}
          onChange={this.handleFilterTextChange}
        />
        <p>
          <input
            type="checkbox"
            checked={this.props.inStockOnly}
            onChange={this.handleInStockChange}
          />
          {' '}
          Only show products in stock
        </p>
      </form>
    );
  }
}

class FilterableProductTable extends React.Component <{products:ProductType[]},{filterText:string, inStockOnly:boolean}> {
  constructor(props:{products:ProductType[]}) {
    super(props);
    this.state = {
      filterText: '',
      inStockOnly: false
    };
    
    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    this.handleInStockChange = this.handleInStockChange.bind(this);
  }

  handleFilterTextChange(filterText:string) {
    this.setState({
      filterText: filterText
    });
  }
  
  handleInStockChange(inStockOnly:boolean) {
    this.setState({
      inStockOnly: inStockOnly
    })
  }

  render() {
    return (
      <div>
        <SearchBar
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}
          onFilterTextChange={this.handleFilterTextChange}
          onInStockChange={this.handleInStockChange}
        />
        <ProductTable
          products={this.props.products}
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}
        />
      </div>
    );
  }
}


const PRODUCTS: ProductType [] = [
  {category: 'Sporting Goods', price: '$49.99', stocked: false, name: 'Football'},
  {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
  {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
  {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
  {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
  {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
];

const App: React.FC = () => {
  return (
    <div className="App">
      <FilterableProductTable products={PRODUCTS}/>
    </div>
  );
}

export default App;
