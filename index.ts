import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { vpcId, publicSubnetId } from "./vpc";
import * as fs from "fs";

// Create a security group
const securityGroup = new aws.ec2.SecurityGroup("webSecurityGroup", {
    vpcId: vpcId,
    ingress: [
        { protocol: "tcp", fromPort: 80, toPort: 80, cidrBlocks: ["0.0.0.0/0"] },
        { protocol: "tcp", fromPort: 22, toPort: 22, cidrBlocks: ["0.0.0.0/0"] },
    ],
    egress: [{ protocol: "-1", fromPort: 0, toPort: 0, cidrBlocks: ["0.0.0.0/0"] }],
});

// Read the Dockerfile content
const dockerfilePath = "./Dockerfile";
const dockerfileContent = fs.readFileSync(dockerfilePath, "utf-8");

// Launch a new EC2 instance
const instance = new aws.ec2.Instance("webServer", {
    instanceType: "t2.micro",
    ami: "ami-07543813a68cc4fe9",
    subnetId: publicSubnetId,
    vpcSecurityGroupIds: [securityGroup.id],
    associatePublicIpAddress: true,
    userData: pulumi.interpolate `#!/bin/bash
        set -xe  # Exit script on error and print commands
        apt-get update && apt-get install -y docker.io
        systemctl start docker
        usermod -a -G docker ubuntu
        mkdir -p /home/ubuntu/app
        git clone https://github.com/jeffersonRibeiro/react-shopping-cart.git /home/ubuntu/app
        echo '${dockerfileContent}' > /home/ubuntu/app/Dockerfile
        cd /home/ubuntu/app && docker build -t react-sample-app:latest .
        docker run -d -p 80:3000 react-sample-app:latest
        echo "SUCCESS" > /var/log/user-data-status.log
    `,
    tags: { Name: "Web Server" },
});

// Export outputs
export const instancePublicIp = instance.publicIp;
export const instancePublicDnsName = instance.publicDns;
