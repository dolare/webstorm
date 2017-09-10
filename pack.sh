#!/bin/bash

set -e

DEPLOY_PKG_PATH=deploy
TARGET_PATH=$DEPLOY_PKG_PATH/target
TARGET_ZIP_NAME="package.zip"
TARGET_DEP_PACKAGE_PATH=$TARGET_PATH/.ebextensions/packages/

echo Clean up deploy target directory and zip.
rm -rf $TARGET_PATH
rm -f $DEPLOY_PKG_PATH/$TARGET_ZIP_NAME

echo Create directory.
mkdir -p $TARGET_DEP_PACKAGE_PATH

echo Copy dependencies
cp ../grid-core-db/dist/grid-core-db-*.tar.gz $TARGET_DEP_PACKAGE_PATH
cp ../webtracking-db/dist/webtracking-db-*.tar.gz $TARGET_DEP_PACKAGE_PATH
cp ../service-interceptor/dist/service_interceptor-*.tar.gz $TARGET_DEP_PACKAGE_PATH

echo prepare package
git archive --format=tar HEAD:src/ | tar xf - -C $TARGET_PATH

cd $TARGET_PATH

echo Inject Prod package dependencies
cat ../requirements_prod.txt >> requirements.txt

echo Pack zip to $DEPLOY_PKG_PATH/$TARGET_ZIP_NAME
zip -r ../$TARGET_ZIP_NAME . > /dev/null

cd ../..

