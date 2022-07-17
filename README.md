# ws-product-nodejs project

## For Docker image

    docker pull ahmadmarhaba/nodejs-demo

## My github profile

    https://github.com/ahmadmarhaba

## Sample project github

    https://github.com/ahmadmarhaba/ws-product-nodejs

## Github actions results

    https://github.com/ahmadmarhaba/ws-product-nodejs/actions/runs/2683392038

## For Terraform kubernetes commands

    terraform init
    terraform plan
    terraform apply

    kubectl get ns k8s-ns-by-tf
    kubectl get deployment -n k8s-ns-by-tf
    kubectl get pods -n k8s-ns-by-tf

    terraform destroy

## For performance
    
    Folder: Performance

        File: Test Plan, file-type: jmeter
        File: Data, file-type: performance monitor

        File: Thread Group, file-type: png

        File: Aggregate Report, file-type: png
        File: Summary Report, file-type: png
        File: View Results Tree, file-type: png
    
    Summary: Identifying Performance Bottlenecks lists hardware classes according to relative access speed, implying that slow access points, such as disks, are more likely to be the source of bottlenecks. However, processors that are underpowered to handle large loads are also likely sources of bottlenecks.

    Tuning/scaling suggestions:

    - Make each REST resource is a small entity. Don't read data from join of many tables.
    - Read data from near by databases
    - Use caches (Redis) instead of databases(You can save DISK I/O)
    - Always keep data sources as much as near by because these blocks will make server resources (CPU) ideal and it no other request can use that resource while it is ideal.





