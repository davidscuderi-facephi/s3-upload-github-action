# s3-upload-github-action

S3 uploader for Github Actions.

You can upload files or directories to any S3 compatible cloud buckets.

## Usage

See the following example.

```YAML
# inside .github/workflows/action.yml
name: Add File to Bucket
on: push

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@master

      - name: Upload file to bucket
        uses: DemaTrading-ai/s3-upload-github-action@master
        env:
          FILE: ./file_or_dir_to_upload/
          S3_PREFIX: target_directory
          S3_ENDPOINT: 'https://s3.nl-ams.scw.cloud'
          S3_BUCKET: bucket_name
          S3_ACL: private
          S3_ACCESS_KEY_ID: ${{ secrets.AWS_KEY_ID }}
          S3_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```
