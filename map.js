const hospitals = [{
    id: 1,
    position: [
        6.936741,
        79.927032
    ]
},
{
    id: 2,
    position: [
        6.9188,
        79.869
    ]
},
{
    id: 3,
    position: [
        7.0296,
        79.9232
    ]
},
{
    id: 4,
    position: [
        6.070582,
        80.22516
    ]
},
{
    id: 5,
    position: [
        8.3248,
        80.414
    ]
},
{
    id: 6,
    position: [
        7.4791,
        80.3591
    ]
},
{
    id: 7,
    position: [
        9.6627,
        80.0215
    ]
},
{
    id: 8,
    position: [
        7.2876,
        80.6323
    ]
},
{
    id: 9,
    position: [
        7.708,
        81.6906
    ]
},
{
    id: 10,
    position: [
        7.0914,
        80.0007
    ]
},
{
    id: 11,
    position: [
        7.212,
        79.849
    ]
},
{
    id: 12,
    position: [
        6.6868,
        80.3931
    ]
},
{
    id: 13,
    position: [
        6.9907777,
        81.0538383
    ]
},
{
    id: 14,
    position: [
        6.9177,
        79.8740737
    ]
},
{
    id: 15,
    position: [
        6.92,
        79.8706
    ]
},
{
    id: 16,
    position: [
        7.9432,
        81.0096
    ]
},
{
    id: 17,
    position: [
        6.88333,
        79.88333
    ]
},
{
    id: 18,
    position: [
        6.9096708,
        79.8849839
    ]
},
{
    id: 19,
    position: [
        6.1275,
        81.1222
    ]
},
{
    id: 20,
    position: [
        6.8714,
        81.3487
    ]
},
{
    id: 21,
    position: [
        7.9476167,
        81.2458904
    ]
},
{
    id: 22,
    position: [
        6.5632,
        79.9853
    ]
},
{
    id: 23,
    position: [
        7.0242,
        79.9029
    ]
},
{
    id: 24,
    position: [
        6.9249,
        79.9429
    ]
},
{
    id: 25,
    position: [
        6.8473,
        79.9919
    ]
},
{
    id: 26,
    position: [
        6.9245,
        79.9626
    ]
},
{
    id: 27,
    position: [
        7.5723,
        79.7973
    ]
},
{
    id: 28,
    position: [
        5.9479,
        80.5497
    ]
},
{
    id: 29,
    position: [
        6.8252,
        79.9072
    ]
},
{
    id: 29,
    position: [
        6.8252,
        79.9072
    ]
},
{
    id: 29,
    position: [
        6.8252,
        79.9072
    ]
},
{
    id: 30,
    position: [
        8.7606,
        80.5001
    ]
},
{
    id: 31,
    position: [
        7.3937,
        79.8327
    ]
},
{
    id: 32,
    position: [
        6.8685,
        79.9255
    ]
},
{
    id: 33,
    position: [
        6.4788,
        79.9828
    ]
},
{
    id: 34,
    position: [
        7.6851,
        81.7391
    ]
},
{
    id: 35,
    position: [
        7.1723,
        79.9562
    ]
},
{
    id: 36,
    position: [
        7.0185,
        79.9008
    ]
}
];

const _markers = [];
const _hospitals = [];
let _infowindow = null;

const _parseHospitalData = (hospitalData) => {

    if (!Array.isArray(hospitalData)) return [];
    console.log("need to update", hospitalData.length > hospitals.length);

    return hospitalData.map(hospital => {
        const { position } = hospitals.find(x => x.id === hospital.hospital_id) ? hospitals.find(x => x.id === hospital.hospital_id) : {
            id: hospitals.length + 1,
            position: [
                6.5632,
                79.9853
            ]
        };
        return { ...hospital, position: position };
    });
};

const _getInfoText = (_hospital) => {
    const template = `
        <div class='hospital-name'>
            <label>${_hospital.hospital.name}</label><br/>
            <label>${_hospital.hospital.name_si}</label><br/>
            <label>${_hospital.hospital.name_ta}</label>
        </div>
        <div class="stats-container">
            <div class="stats">
            <div class="count">${_hospital.treatment_local}</div>
            <div class="title">Local patients</div>
            </div>
            <div class="stats">
            <div class="count">${_hospital.treatment_foreign}</div>
            <div class="title">Foreign patients</div>
            </div>
            <div class="stats">
            <div class="count">${_hospital.treatment_total}</div>
            <div class="title">Total</div>
            </div>
        </div>
    `;

    return template;
};

const _renderNavigator = (hospitalData) => {
    const navigatorList = document.querySelector('#navigator-list');
    if (!navigatorList) return;

    hospitalData.forEach((_hospital) => {
        const listItem = document.createElement('li');
        listItem.classList.add('navigator-item');
        listItem.setAttribute('data-hospital-id', _hospital.hospital_id);
        listItem.innerHTML = `${_hospital.hospital.name}<br/>${_hospital.hospital.name_si}<br/>${_hospital.hospital.name_ta}`;
        listItem.addEventListener('click', gotoMarker(_hospital.hospital_id));

        navigatorList.appendChild(listItem);
    });


};

const _renderMap = (localData, map) => {
    if (localData && localData.hospital_data) {
        const hospitalData = _parseHospitalData(localData.hospital_data);
        _infowindow = new google.maps.InfoWindow({});

        hospitalData.forEach((_hospital) => {
            _hospitals.push(_hospital);
            const marker = new google.maps.Marker({
                position: new google.maps.LatLng(_hospital.position[0], _hospital.position[1]),
                map: map,
                mapTypeId: 'roadmap',
                title: _hospital.hospital.name
            });

            google.maps.event.addListener(marker, 'click', ((marker) => {
                return () => {
                    const infoText = _getInfoText(_hospital);
                    _infowindow.setContent(infoText);
                    _infowindow.open(map, marker);

                    map.setCenter(marker.getPosition());
                    map.setZoom(9);
                }
            })(marker));

            _markers.push({
                id: _hospital.hospital_id,
                marker
            });
        });

        _renderNavigator(hospitalData);
    }
};


function gotoMarker(hospitalId) {
    const _hospital = _hospitals.find(x => x.hospital_id === hospitalId);
    if (!_hospital) return;

    return () => {
        const _marker = _markers.find(x => x.id === hospitalId);
        if (!_marker) return;

        const marker = _marker.marker;
        const map = marker.getMap();
        const infoText = _getInfoText(_hospital);
        _infowindow.setContent(infoText);
        _infowindow.open(map, marker);

        map.setCenter(marker.getPosition());
        map.setZoom(9);
    }
}

function initMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: new google.maps.LatLng(7.8731, 80.7718),
        mapTypeControl: false,
        streetViewControl: false,
        styles: [{
            elementType: 'labels.text.fill',
            stylers: [{ color: '#746855' }]
        },
        {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }]
        },
        {
            featureType: "all",
            elementType: "labels.icon",
            stylers: [{ "visibility": "on" }]
        }
        ]
    });

    chrome.storage.local.get('COVID19STATISTICS', (result) => {
        _renderMap(result['COVID19STATISTICS'], map);
    });
};