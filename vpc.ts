import * as aws from "@pulumi/aws";

// Create a VPC
const vpc = new aws.ec2.Vpc("vpc", {
    cidrBlock: "10.0.0.0/16",
    enableDnsHostnames: true,
    enableDnsSupport: true,
});

// Create a public subnet
const publicSubnet = new aws.ec2.Subnet("publicSubnet", {
    vpcId: vpc.id,
    cidrBlock: "10.0.1.0/24",
    mapPublicIpOnLaunch: true,
});

// Create an Internet Gateway
const internetGateway = new aws.ec2.InternetGateway("internetGateway", {
    vpcId: vpc.id,
});

// Create a Route Table
const routeTable = new aws.ec2.RouteTable("routeTable", {
    vpcId: vpc.id,
    routes: [{ cidrBlock: "0.0.0.0/0", gatewayId: internetGateway.id }],
});

// Associate the Route Table with the public subnet
new aws.ec2.RouteTableAssociation("routeTableAssociation", {
    subnetId: publicSubnet.id,
    routeTableId: routeTable.id,
});

export const vpcId = vpc.id;
export const publicSubnetId = publicSubnet.id;
