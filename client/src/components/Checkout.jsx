import React, { useEffect, useState } from "react";
import "../componentsCss/checkout.css";
import { Button, Card, CardContent, FormControlLabel, Grid, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { NumericFormat } from "react-number-format";
import axios from "axios";
import { CatCart, DogCart } from "./AddToCart";

function Checkout() {
  const [isAddAdrdress, setIsAddAddress] = useState(false);
  const [addressContent, setAddressContent] = useState([]);
  const [access, SetAccess] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [finalPrice, setFinalPrice] = useState(0);
  const [deliveryDate,setDeliveryDate]= useState(null);
  const [paymentCaptcha, setPaymentCaptch] = useState("");
  const [captcha, setCaptcha] = useState("");

  const [selectedAddress, setSelectedAddress] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchingAddress();
    fetchingCartItems();
  }, [access]);

  useEffect(() => {
    calculateTotalPrice();
  }, [cartItems]);

  useEffect(() => {
    generateCaptcha();
  }, []);

  async function fetchingAddress() {
    const response = await axios.get("http://localhost:5000/api/address", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAddressContent(response.data.message);
  }

  function handleAddress() {
    setIsAddAddress((prev) => !prev);
  }

  async function fetchingCartItems() {
    const response = await axios.get("http://localhost:5000/api/cart", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCartItems(response.data.cartData);
  }

  function calculateTotalPrice() {
    const value = cartItems.reduce((total, { price, qty }) => {
      return total + price * qty;
    }, 0);
    setFinalPrice(value);
  }

  function generateCaptcha(length = 6) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let captcha = "";
    for (let i = 0; i < length; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPaymentCaptch(captcha);
  }

  function handleCaptch({ target: { value } }) {
    setCaptcha(value);
  }

  async function sentOrder() {
    const date = new Date()
    let cartData = [...cartItems];
    cartData = cartData.map((data)=>({
      ...data,
      ordered:String(date),
      delivery:deliveryDate
    }))
    await axios.post('http://localhost:5000/api/orders',cartData,{headers:{Authorization:`Bearer ${token}`}})
  }

  async function clearCart() {
    await axios.post("http://localhost:5000/api/cart/clear", [], {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  function handleSubmit() {
    sentOrder()
    clearCart()
    setCaptcha('');
    setCartItems([]);
    setFinalPrice(0);
  }

  return (
    <Grid className="checkoutContainer">
      <Grid className="leftSideContent">
        <Grid className="addressContainer">
          <AddAddress changeFun={handleAddress} />
        </Grid>
        {isAddAdrdress ? (
          <Card className="newAddressContent">
            <NewAddressForm userToken={token} accessData={SetAccess} addresshandle={setIsAddAddress} />
          </Card>
        ) : null}
        <Grid className="addressDisplay">
          <AddressDisplay content={addressContent} onDataReceive={setSelectedAddress} />
        </Grid>
        <Grid className="cartitems">
          <DisplayCartItems content={cartItems} />
        </Grid>
      </Grid>
      <Grid className="rightSideContent">
        <Grid className="showAddress">
          <Typography variant="body2" className="addressBody">
            {" "}
            <span style={{ fontWeight: "bold" }}>Address :</span>{" "}
            {selectedAddress != null
              ? `${selectedAddress.personName},${selectedAddress.address},${selectedAddress.locality},${selectedAddress.landmark},${selectedAddress.city},${selectedAddress.state},${selectedAddress.pincode}`
              : null}{" "}
          </Typography>
          <Typography variant="body2" className="addressBody" style={{ fontWeight: "bold" }}>
            {selectedAddress != null
              ? `${selectedAddress.mobilenumber} ${selectedAddress.alternate}`
              : null}
          </Typography>
        </Grid>
        <Grid className="delivery">
          <DeliveryDetails deliveryPeriod={3} deliveryFunc={setDeliveryDate} />
        </Grid>
        <Grid className="totalPrice">
          <Typography variant="body2" style={{ fontWeight: "bold", fontSize: "1.25rem" }}> Total :{" "} </Typography>
          <Typography variant="body2" style={{ fontWeight: "bold", fontSize: "1.25rem" }}> {finalPrice} </Typography>
        </Grid>
        <Grid className="paymentMode">
          <Typography variant="body1" style={{ fontWeight: "bold" }}>
            Payment :{" "}
          </Typography>
          <FormControlLabel control={<Radio defaultChecked />} label="COD" />
          <Grid className="captcha">
            <Typography variant="body1">CAPTCHA : </Typography>
            <TextField variant="standard" value={paymentCaptcha} disabled />
          </Grid>
          <Grid className="verifyCaptcha">
            <TextField variant="outlined" style={{ fontWeight: "bold" }} value={captcha} onChange={handleCaptch}/>
            <Button variant="contained" disabled={paymentCaptcha != captcha} onClick={handleSubmit}> Pay </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

function AddAddress({ changeFun }) {
  return (
    <Card className="card">
      <Grid className="addressContent">
        <Typography variant="body1" style={{ fontWeight: "bold" }}>
          DELIVERY ADDRESS
        </Typography>
      </Grid>
      <Grid className="addressBtn">
        <Button type="button" variant="outlined" onClick={changeFun}>
          + Add new address
        </Button>
      </Grid>
    </Card>
  );
}

function NewAddressForm({ userToken, accessData, addresshandle }) {
  const [addressData, setAddressData] = useState({ personName: "", mobilenumber: "", pincode: "", locality: "", address: "", city: "", state: "", landmark: "", alternate: "",});

  async function handleAddressData({ target }) {
    const { name, value } = target;
    setAddressData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "pincode" && value.length === 6) {
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${value}`
      );
      if (response.data[0].Status != "Error") {
        const town = response.data.map(({ PostOffice }) => {
          const cityAndState = {
            city: PostOffice[0].Block,
            State: PostOffice[0].Circle,
          };
          return cityAndState || null;
        });
        setAddressData((prev) => ({
          ...prev,
          city: town[0].city,
          state: town[0].State,
        }));
      }
    }
  }

  async function submit(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/address",
        addressData,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      const sendData = () => {
        return addressData;
      };
      accessData(sendData);
      if (response.status === 200)
        setAddressData({ personName: "", mobilenumber: "", pincode: "", locality: "", address: "", city: "", state: "", landmark: "", alternate: "" });
      addresshandle(false);
    } catch (error) {
      console.log("submit form data error", error);
    }
  }

  return (
    <form onSubmit={submit}>
      <Grid className="inputData nameContent">
        <TextField
          variant="outlined"
          label="Name"
          name="personName"
          onChange={handleAddressData}
          value={addressData.personName}
          required
        />
        <NumericFormat
          placeholder="Mobile Number"
          name="mobilenumber"
          onChange={handleAddressData}
          value={addressData.mobilenumber}
          isAllowed={(values) => {
            const { floatValue } = values;
            return floatValue === undefined || floatValue <= 9999999999;
          }}
          required
        />
      </Grid>
      <Grid className="inputData pincode">
        <NumericFormat
          placeholder="Pincode"
          name="pincode"
          onChange={handleAddressData}
          value={addressData.pincode}
          isAllowed={(values) => {
            const { floatValue } = values;
            return floatValue === undefined || floatValue <= 999999;
          }}
          required
        />
        <TextField
          variant="outlined"
          label="Locality"
          name="locality"
          onChange={handleAddressData}
          value={addressData.locality}
        />
      </Grid>
      <Grid className="inputData inputAddress">
        <TextField
          variant="outlined"
          id="filled-multiline-static"
          label="Address"
          required
          className="addressBox"
          multiline
          rows={5}
          name="address"
          value={addressData.address}
          onChange={handleAddressData}
        />
      </Grid>
      <Grid className="inputData city&State">
        <TextField
          variant="outlined"
          label="city"
          name="city"
          onChange={handleAddressData}
          value={addressData.city}
          required
        />
        <TextField
          variant="outlined"
          label="State"
          name="state"
          onChange={handleAddressData}
          value={addressData.state}
          required
        />
      </Grid>
      <Grid className="inputData landmark">
        <TextField
          variant="outlined"
          label="Landmark"
          name="landmark"
          onChange={handleAddressData}
          value={addressData.landmark}
        />
        <TextField
          variant="outlined"
          label="Alternate Phone Number"
          name="alternate"
          onChange={handleAddressData}
          value={addressData.alternate}
        />
      </Grid>
      <Grid className="saveBtn">
        <Button type="submit" variant="contained">
          Save
        </Button>
      </Grid>
    </form>
  );
}

function AddressDisplay({ content, onDataReceive }) {
  const [selectedValue, setSelectedValue] = useState("0");
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    handleSelect({ target: { value: "0" } });
    onDataReceive(content[selectedValue]);
  }, [content, selectedIndex]);

  function handleSelect({ target: { value } }) {
    setSelectedValue(value);
  }

  function handleIndex(index) {
    setSelectedIndex(index);
  }

  return (
    <>
      <RadioGroup
        value={selectedValue}
        onChange={handleSelect}
        className="radioGroup"
      >
        {content.map((data, index) => (
          <Card key={index} className="card">
            <FormControlLabel
              value={String(index)}
              control={
                <Radio
                  onChange={() => handleIndex(index)}
                  checked={selectedIndex === index}
                />
              }
              label={
                <CardContent className="cardContent">
                  <Typography variant="body1" className="userName">
                    {data.personName}
                  </Typography>
                  <Typography variant="body2" className="userAddress">
                    {data.address},{data.locality},{data.landmark},{data.city},
                    {data.state},{data.pincode}
                  </Typography>
                  <Typography variant="body2" className="userPhoneNumber">
                    {data.mobilenumber} {data.alternate}
                  </Typography>
                </CardContent>
              }
            />
          </Card>
        ))}
      </RadioGroup>
    </>
  );
}

function DisplayCartItems({ content }) {
  return (
    <>
      {content.map((data) =>
        data.id ? (
          <CatCart key={data._id} content={data} display="true" />
        ) : (
          <DogCart key={data._id} content={data} display="true" />
        )
      )}
    </>
  );
}

function DeliveryDetails({ deliveryPeriod, deliveryFunc }) {
  const [deliveryDate, setDeliveryDate] = useState(null);

  useEffect(() => {
    deliveryDateSetup();
  }, [deliveryPeriod]);

  const date = new Date();
  const fullMonth = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  date.setDate(date.getDate() + deliveryPeriod);

  function deliveryDateSetup() {
    const day = date.getDate();
    const month = fullMonth[date.getMonth()];
    const year = date.getFullYear();
    const stringDay = String(day).padStart(2, "0");
    const fullYear = `${stringDay}-${month}-${year}`;
    setDeliveryDate(fullYear);
    deliveryFunc(fullYear);
  }

  return (
    <>
      <Typography
        variant="body2"
        style={{ fontWeight: "bold", fontSize: "1.25rem" }}
      >
        Delivery :{" "}
      </Typography>
      <Typography
        variant="body2"
        style={{ fontWeight: "bold", fontSize: "1.25rem" }}
      >
        {deliveryDate}
      </Typography>
    </>
  );
}

export default Checkout;
