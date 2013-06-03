djConfig = {
    packages: [
        { name: 'mytime', location: buster.env.contextPath + '/script/mytime' }
    ]
};

buster.log("DOJO resource");
buster.log(djConfig);