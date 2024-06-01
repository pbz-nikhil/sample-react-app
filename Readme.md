# Pulumi Deployment Project

This repository contains a Pulumi project that deploys a web server using [sample react app](https://github.com/jeffersonRibeiro/react-shopping-cart)
on AWS or LocalStack using Docker Compose.

This repository uses **AWS profiles** (`aws` for AWS and `localstack` for LocalStack) to authenticate with AWS services. Ensure your AWS CLI is configured with the appropriate profile before running pulumi commands.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Deploy to AWS](#deploy-to-aws)
    - [Setup and Deployment](#setup-and-deployment-to-aws)
3. [Deploy to LocalStack](#deploy-to-localstack)
    - [Setup and Deployment](#setup-and-deployment-to-localstack)
4. [Limitations](#localstack-limitations)

## Prerequisites

Before deploying to AWS or LocalStack, ensure you have the following installed and configured:

- **Docker & Docker Compose**: [Install Docker](https://docs.docker.com/get-docker/)
- **AWS CLI**: [Install AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
- **Pulumi CLI**: [Install Pulumi CLI](https://www.pulumi.com/docs/get-started/install/)
- **LocalStack CLI** (for communication with LocalStack ): [Install LocalStack CLI](https://docs.localstack.cloud/getting-started/installation/)

## Deploy to AWS

### Setup and Deployment to AWS

1. **Configure AWS CLI for AWS Profile**:
    ```bash
    aws configure --profile aws
    ```

    Follow the prompts to enter your AWS Access Key ID, Secret Access Key, AWS Region, and output format.

2. **Set AWS CLI Profile for AWS**:
    ```bash
    export AWS_PROFILE=aws
    ```

3. **Set Up Pulumi Project**:
    
    **_NOTE:_**  Ensure the directory is empty, Clone this repo after pulumi is configured

    ```bash
    pulumi new aws-typescript
    ```

    Follow the prompts to create a new Pulumi project. Create new stack for aws

5. **Deploy to AWS**:
    ```bash
    pulumi up
    ```

    Preview the changes and confirm yes to deploy the infrastructure to AWS.

## Deploy to LocalStack

### Setup and Deployment to LocalStack

1. **Start LocalStack**:
    ```bash
    docker-compose up
    ```

    Start LocalStack services using Docker Compose.

2. **Check LocalStack Status**:
    Ensure LocalStack services are running before proceeding.

    ```bash
    curl -sSf http://localhost:4566/_localstack/health
    ```

3. **Configure AWS CLI for LocalStack Profile**:

    - `~/.aws/credentials`
    ```ini
    [localstack]
    aws_access_key_id = test
    aws_secret_access_key = test
    ```

    - `~/.aws/config`
    ```ini
    [profile localstack]
    region = us-east-1
    output = json
    endpoint_url = http://localhost:4566
    ```

4. **Set AWS CLI Profile for LocalStack**:
    ```bash
    export AWS_PROFILE=localstack
    ```

5. **Set Pulumi Stack for LocalStack**:
    ```bash
    pulumi stack init localstack
    ```

    Initialize the Pulumi stack for LocalStack.

6. **Deploy to LocalStack**:

    **_NOTE:_**  Ensure the selected stack before confirming deployment.

    ```bash
    pulumi up
    ```

    Preview the changes and confirm yes to deploy the infrastructure to AWS.

## Localstack Limitations

The current image of **LocalStack Community Edition** has limitations compared to the Pro Edition. While you can use the EC2 API, it does not creates emulated EC2 instances in your HOST.It means we will not able to test the launched web application or connect EC2 through SSH.
