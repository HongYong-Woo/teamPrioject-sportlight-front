const priceFormatter = (price) => {
    if(price == null) return "0원";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '원';
}

export default priceFormatter;