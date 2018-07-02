import React, { Component } from "react";
import {
  Button,
  Progress,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  Modal,
  ModalHeader,
  ModalBody,
  Card,
  CardBody
} from "reactstrap";

import { actions, connect } from "../store";
import QRious from "qrious";

class Payments extends Component {
  constructor(props) {
    super(props);
    actions.getInfo();
    actions.getSettings();
  }
  render() {
    const { info, settings } = this.props.state;

    if (!info || !settings) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <h1>Payments</h1>
        <div
          style={{
            display: "flex",
            flexDirection: "column"
          }}
        >
          <MoneyBar avgUse={100 + 12} currentFunds={info.balance} />
          <RefillFunds address={settings.payment.ethAddress} />
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              padding: 10,
              margin: -20
            }}
          >
            {/* <LowFunds />
            <PriceQuality /> */}
          </div>
        </div>
      </div>
    );
  }
}

function LowFunds() {
  return (
    <Card style={{ flex: 1, minWidth: 300, maxWidth: 400, margin: 10 }}>
      <CardBody>
        <h3>When funds get low:</h3>

        <Form>
          <FormGroup>
            <Label for="exampleEmail">Threshold</Label>
            <InputGroup>
              <Input style={{ width: "5em" }} type="number" value="10" />
              <InputGroupAddon addonType="append">
                % of average monthly use
              </InputGroupAddon>
            </InputGroup>
          </FormGroup>

          {/* <FormGroup check style={{ marginBottom: ".5rem" }}>
          <Label check>
            <Input type="checkbox" /> Send an email to this address:
          </Label>
          </FormGroup>

          <FormGroup>
            <Input type="email" name="email" id="exampleEmail" />
          </FormGroup> */}

          <FormGroup check>
            <Label check>
              <Input type="checkbox" /> Throttle speed
            </Label>
          </FormGroup>
        </Form>
      </CardBody>
    </Card>
  );
}

function PriceQuality() {
  return (
    <Card style={{ flex: 1, minWidth: 300, maxWidth: 400, margin: 10 }}>
      <CardBody>
        <h3>Price/Quality tradeoff:</h3>

        <Form>
          <FormGroup>
            <Input type="range" />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <small>Prefer low price</small>
              <small>Prefer high quality</small>
            </div>
          </FormGroup>

          <FormGroup>
            <Label for="exampleEmail">Highest acceptable price</Label>
            <InputGroup>
              <Input type="number" value="10" />
              <InputGroupAddon addonType="append">cents/GB</InputGroupAddon>
            </InputGroup>
          </FormGroup>
        </Form>
      </CardBody>
    </Card>
  );
}

class RefillFunds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addressModal: false
    };
  }

  toggleAddressModal = () => {
    this.setState({
      addressModal: !this.state.addressModal
    });
  };
  render() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: 60,
          marginBottom: 60
        }}
      >
        <Button
          onClick={this.toggleAddressModal}
          outline
          color="primary"
          size="lg"
        >
          Refill Funds
        </Button>

        <Modal
          isOpen={this.state.addressModal}
          toggle={this.toggleAddressModal}
        >
          <ModalHeader toggle={this.toggleAddressModal}>
            Send Ether to this address:
          </ModalHeader>
          <ModalBody
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <img
              src={new QRious({
                size: 256,
                value: this.props.address
              }).toDataURL()}
            />
            {this.props.address}
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

function MoneyBar({ avgUse, currentFunds }) {
  let currentFundsPos, avgUsePos;
  const scaling = 85;
  if (currentFunds < avgUse) {
    currentFundsPos = (currentFunds / avgUse) * scaling;
    avgUsePos = scaling;
  } else {
    avgUsePos = (avgUse / currentFunds) * scaling;
    currentFundsPos = scaling;
  }

  let color;
  if (currentFunds > 25) {
    color = "success";
  } else if (currentFunds > 10) {
    color = "warning";
  } else {
    color = "danger";
  }

  return (
    <div>
      <PercentSpacer
        progress={currentFundsPos}
        pointer="↓"
        pointerAlign="bottom"
      >
        Current funds: ${currentFunds}
      </PercentSpacer>
      <Progress striped color={color} value={currentFundsPos} />
      <PercentSpacer progress={avgUsePos} pointer="↑">
        Average monthly use: ${avgUse}
      </PercentSpacer>
    </div>
  );
}

function PercentSpacer({ children, progress, pointer, pointerAlign }) {
  if (progress < 50) {
    return (
      <div style={{ textAlign: "left", display: "flex" }}>
        <div
          style={{
            width: `${progress}%`,
            marginLeft: ".5em",
            textAlign: "right"
          }}
        >
          {pointer}
        </div>
        <div
          style={{
            width: `${100 - progress}%`,
            textAlign: "left"
          }}
        >
          {children}
        </div>
      </div>
    );
  } else {
    return (
      <div style={{ textAlign: "right", display: "flex" }}>
        <div
          style={{
            width: `${progress}%`,
            textAlign: "right",
            display: "inline-block"
          }}
        >
          {children}
        </div>
        <div
          style={{
            width: `${100 - progress}%`,
            marginRight: ".7em",
            textAlign: "left"
          }}
        >
          {pointer}
        </div>
      </div>
    );
  }
}

export default connect(["settings", "info"])(Payments);
