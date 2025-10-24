#!/bin/bash
# DVTC LocalStack API Gateway Setup - INTENTIONALLY VULNERABLE FOR CTF

# Set AWS credentials for LocalStack
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_REGION=us-east-1
echo "Setting up API Gateway with vulnerable endpoints..."

# Create REST API
API_ID=$(aws --endpoint-url=http://localhost:4566 apigateway create-rest-api \
    --name dvtc-api \
    --description "DVTC Trust Center API (Intentionally Vulnerable)" \
    --query 'id' \
    --output text)

echo "Created API with ID: $API_ID"

# Get root resource ID
ROOT_ID=$(aws --endpoint-url=http://localhost:4566 apigateway get-resources \
    --rest-api-id $API_ID \
    --query 'items[0].id' \
    --output text)

# Create /generateReport resource
REPORT_RESOURCE_ID=$(aws --endpoint-url=http://localhost:4566 apigateway create-resource \
    --rest-api-id $API_ID \
    --parent-id $ROOT_ID \
    --path-part generateReport \
    --query 'id' \
    --output text)

# Create GET method for /generateReport (VULNERABILITY: No auth required)
aws --endpoint-url=http://localhost:4566 apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $REPORT_RESOURCE_ID \
    --http-method GET \
    --authorization-type NONE \
    --no-api-key-required

# Integrate with Lambda
aws --endpoint-url=http://localhost:4566 apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $REPORT_RESOURCE_ID \
    --http-method GET \
    --type AWS \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:000000000000:function:generate_report/invocations" \
    --request-templates '{"application/json": "{\"queryStringParameters\": {#foreach($param in $input.params().querystring.keySet())\"$param\": \"$util.escapeJavaScript($input.params().querystring.get($param))\"#if($foreach.hasNext),#end#end}}"}'

# Create POST method for /generateReport
aws --endpoint-url=http://localhost:4566 apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $REPORT_RESOURCE_ID \
    --http-method POST \
    --authorization-type NONE \
    --no-api-key-required

# Integrate POST with Lambda
aws --endpoint-url=http://localhost:4566 apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $REPORT_RESOURCE_ID \
    --http-method POST \
    --type AWS \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:000000000000:function:generate_report/invocations"

# Create /admin resource
ADMIN_RESOURCE_ID=$(aws --endpoint-url=http://localhost:4566 apigateway create-resource \
    --rest-api-id $API_ID \
    --parent-id $ROOT_ID \
    --path-part admin \
    --query 'id' \
    --output text)

# Create /admin/downloadAuditTrail resource
AUDIT_RESOURCE_ID=$(aws --endpoint-url=http://localhost:4566 apigateway create-resource \
    --rest-api-id $API_ID \
    --parent-id $ADMIN_RESOURCE_ID \
    --path-part downloadAuditTrail \
    --query 'id' \
    --output text)

# Create GET method for /admin/downloadAuditTrail (VULNERABILITY: Auth check commented out)
aws --endpoint-url=http://localhost:4566 apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $AUDIT_RESOURCE_ID \
    --http-method GET \
    --authorization-type NONE \
    --no-api-key-required
    # --authorization-type AWS_IAM  # TODO: Enable auth before production

# Integrate with Lambda
aws --endpoint-url=http://localhost:4566 apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $AUDIT_RESOURCE_ID \
    --http-method GET \
    --type AWS \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:000000000000:function:download_audit_trail/invocations"

# Create /compliance resource
COMPLIANCE_RESOURCE_ID=$(aws --endpoint-url=http://localhost:4566 apigateway create-resource \
    --rest-api-id $API_ID \
    --parent-id $ROOT_ID \
    --path-part compliance \
    --query 'id' \
    --output text)

# Create /compliance/status resource
STATUS_RESOURCE_ID=$(aws --endpoint-url=http://localhost:4566 apigateway create-resource \
    --rest-api-id $API_ID \
    --parent-id $COMPLIANCE_RESOURCE_ID \
    --path-part status \
    --query 'id' \
    --output text)

# Create GET method for /compliance/status
aws --endpoint-url=http://localhost:4566 apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $STATUS_RESOURCE_ID \
    --http-method GET \
    --authorization-type NONE \
    --no-api-key-required

# Integrate with Lambda
aws --endpoint-url=http://localhost:4566 apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $STATUS_RESOURCE_ID \
    --http-method GET \
    --type AWS \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:000000000000:function:compliance_checker/invocations"

# Create method responses for all endpoints
for RESOURCE_ID in $REPORT_RESOURCE_ID $AUDIT_RESOURCE_ID $STATUS_RESOURCE_ID; do
    aws --endpoint-url=http://localhost:4566 apigateway put-method-response \
        --rest-api-id $API_ID \
        --resource-id $RESOURCE_ID \
        --http-method GET \
        --status-code 200 \
        --response-parameters '{"method.response.header.Access-Control-Allow-Origin": false}' 2>/dev/null

    aws --endpoint-url=http://localhost:4566 apigateway put-integration-response \
        --rest-api-id $API_ID \
        --resource-id $RESOURCE_ID \
        --http-method GET \
        --status-code 200 \
        --response-parameters '{"method.response.header.Access-Control-Allow-Origin": "'"'"'*'"'"'"}' \
        --response-templates '{"application/json": "$input.body"}' 2>/dev/null
done

# Deploy the API
aws --endpoint-url=http://localhost:4566 apigateway create-deployment \
    --rest-api-id $API_ID \
    --stage-name prod \
    --stage-description "Production deployment (vulnerable)"

# Create API key (but don't require it - VULNERABILITY)
API_KEY=$(aws --endpoint-url=http://localhost:4566 apigateway create-api-key \
    --name dvtc-api-key \
    --description "API key for DVTC (not enforced)" \
    --enabled \
    --query 'value' \
    --output text)

# Save API configuration for backend
echo "{
    \"api_id\": \"$API_ID\",
    \"api_url\": \"http://localhost:4566/restapis/$API_ID/prod/_user_request_\",
    \"api_key\": \"$API_KEY\",
    \"endpoints\": {
        \"generate_report\": \"/generateReport\",
        \"audit_trail\": \"/admin/downloadAuditTrail\",
        \"compliance_status\": \"/compliance/status\"
    }
}" > /tmp/api-gateway-config.json

echo "API Gateway configured with vulnerable endpoints!"
echo "API URL: http://localhost:4566/restapis/$API_ID/prod/_user_request_"
echo "Vulnerable endpoints:"
echo "  - /generateReport (no auth, template injection)"
echo "  - /admin/downloadAuditTrail (auth bypassed)"
echo "  - /compliance/status (info disclosure)"