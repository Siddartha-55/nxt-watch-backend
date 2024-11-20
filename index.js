const axios = require('axios');
const fs = require('fs');

// JWT Token
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhaHVsIiwicm9sZSI6IlBSSU1FX1VTRVIiLCJpYXQiOjE2MjMwNjU1MzJ9.D13s5wN3Oh59aa_qtXMo3Ec4wojOx0EZh8Xr5C5sRkU";

// Video IDs
const videoIds = [
    '00780a5b-0b73-4cbe-91c6-91371fd8f078',
    '018f8cbf-ecc6-403b-96c5-b15736328818',
    '0f6e0294-0cb4-47ec-bba5-981fd9fff86e',
    '10dcb8df-11b3-4f70-9690-4a8929b89816',
    '1cc3a158-6751-4a39-ae6f-c63a72108f12',
    '1f44125f-eeb0-40a7-a2bf-3c8f64e5a17a',
    '268f94b2-ed0c-4f49-a743-0de35d1f2294',
    '2c79fe02-67b8-45f7-b835-aa4971f5c4df',
    '2ebc17f9-fba5-4b24-9f5e-7e12137bb902',
    '2fd4fa94-f8a1-4508-87e9-7cdd279c4a1f',
    '30b642bd-7591-49f4-ac30-5c538f975b15',
    '330f1c47-2608-452a-ad65-e0d9b159d00c',
    '336ef790-5a13-4a43-b7d8-b24866fa9c9d',
    '420f102e-1734-4468-8d3c-797134c505b0',
    '4b42d8a0-5a9d-499e-bfca-f8a68f6d3bf6',
    '4c9d11ec-5d49-4a8e-be31-a40955074b7b',
    '51b73ec6-7cdb-4e6f-b290-868387ada97a',
    '5d7c6c4d-6ab2-48f4-af2d-5c6846180cc7',
    '606f5b7b-9208-4eb2-a68c-1eb5faef4268',
    '6114fac6-44ff-47f8-82df-3426715e0b56',
    '616c16fe-b98a-4397-9a59-74cdd7b9bfb7',
    '66b857d7-9c62-496e-8404-88a6a1ccc295',
    '6fcf2fe2-8cb8-4693-9ee8-45e09f9d2b30',
    '716142b5-fc5c-4a10-b29d-cb746258161c',
    '72274854-be1c-4ffd-9788-1e5d3c2d600c',
    '7650d552-1d4a-40e4-bcf8-1c13d78b38c1',
    '79ddf1f3-65ce-4464-be83-775a8f6a0e5f',
    '7f280933-f36b-4d2f-8f4f-b31b089c8f78',
    '80ef9ba0-61ef-4e65-9f3c-506bfda7e74e',
    '82832be4-a4d0-4613-bf9a-3a0bb3bf7bab',
    '8329b21b-44f2-4229-b4b0-4b7311513526',
    '85afde7d-a685-4a5f-ad2f-c3fc516b2e42',
    '8884c12a-96f7-4f64-843d-d3ecde8eeb4f',
    '89383330-f76c-4ca4-b13b-9b3e9bf8a808',
    '8d308548-9496-448a-b10f-70b173f87e68',
    '9420a07a-df83-419e-a46e-ed308103e829',
    '9a4d9c25-34af-44c8-898e-6bc4ba6c24a4',
    '9d784e89-4d4f-465c-a933-1d03f3a112cb',
    'a25b246c-5b18-44dc-a832-6007c06397af',
    'a294b662-2ae5-408d-93b1-7c8dbe4412fb',
    'a7b783bd-73d8-4b21-bc41-9a00ba015f3d',
    'a9bdf0ed-05e4-407e-b2bb-8a29d4c36ac8',
    'ad9822d2-5763-41d9-adaf-baf9da3fd490',
    'b5f11f30-0b42-4b20-b228-40b611fa463e',
    'beb03ef7-d8dc-4654-bf3f-fbbcc8523966',
    'c049fa98-d91b-43d5-84d6-f57af0b5de6c',
    'c3f9625a-9c01-408d-b6c4-57117d62ee35',
    'c965db6b-5e7f-4541-8412-e4e7e7912399',
    'd1d89ac3-9652-450a-ad6c-2eed76a894d4',
    'd54bee30-49a5-424f-aebe-7719500a5698',
    'e1e964ef-e0d0-44ac-8797-28832ce64e23',
    'e2df788b-ae68-465c-8a3c-b5701d3f9c5b',
    'e426dbb7-cf95-42cb-aca8-9f4d3194b256',
    'e5cb5fc4-102a-4a8a-a8d7-f19a5b11fa7b',
    'ea0a9be4-d94a-41db-82bf-044d8915d6cf',
    'f163fd54-0f08-4cc1-a5aa-308f27132cc6',
    'f1c2182d-568c-47de-89ff-fd612f0bd99d',
    'f3da2507-4ff5-41d0-b6d7-e796df01de25',
    'f3dc2b15-7c71-4ddb-94f1-3f2c86f9751f',
    'fce38366-577c-42a2-9886-312d38e2bd56',
    '00b4af7a-995c-4b88-8d02-4ef776e9ef2d',
    '03641f78-eca9-4231-a2ac-0219f5ddc554',
    '10350061-447e-4377-af2a-00053c4e4214',
    '11c5b163-6b87-4d2f-bbd4-aae2229d4128',
    '15671fed-47a8-4e6c-b0f2-be43085b39b5',
    '20e2f5d3-b556-4bb2-af60-16bcb39a90b0',
    '250d6355-55f2-4466-aa7b-bc5d23059230',
    '2d1a66dc-5daa-4ff4-809a-84a777a0a8ef',
    '2fc5781f-2881-42e6-b0cc-ebdb30f246c6',
    '4426d6c0-279d-4efe-9091-d2570f315a0c',
    '45895678-411a-45f8-92bc-dd2964cf7f27',
    '5025ee2b-6fa5-41de-86b7-6eb11ac2f4c1',
    '5094b343-7f61-4571-b392-58dbed7d5368',
    '541e58ee-1024-4a88-a1a5-8de0a7b5b82e',
    '69ad1aa6-ca21-4103-8275-619e2687da32',
    '6dbf3cd4-b87b-4dd2-90b4-5929329c2df0',
    '6e4e96ac-c259-44e7-95ce-6f7a162fedfc',
    '6e89a153-de5a-4b6b-b600-f4a0bad625b1',
    '74ae9d17-f65b-43e6-9931-56ab8b860991',
    '8c294ff4-1ff1-493f-b703-a60d6044e19c',
    'a8b30db5-71b2-48c2-bd81-0b76a2da3197',
    'b214dc8a-b126-4d15-8523-d37404318347',
    'b507adf6-b5df-4bfe-8727-afe64b192a98',
    'b8653c7f-5be7-49a9-84f8-d9f47842bb78',
    'cb02cd3b-f4a0-4616-8182-d7086d0cf85b',
    'de32fa84-fb89-410b-bb40-49b473897442',
    'edf13c11-7174-4c35-8990-d94e501e263d',
    'f22f51df-c7d5-4d6e-b67b-7cf871d328fc',
    'f5aa0bd0-aaf2-4816-810e-b893f9a5d5a6',
    'fb21cbc1-47e3-4bf5-87f9-9a4509b83cb9',
    '00780a5b-0b73-4cbe-91c6-91371fd8f078',
    '018f8cbf-ecc6-403b-96c5-b15736328818',
    '0f6e0294-0cb4-47ec-bba5-981fd9fff86e',
    '330f1c47-2608-452a-ad65-e0d9b159d00c',
    '336ef790-5a13-4a43-b7d8-b24866fa9c9d',
    '4b42d8a0-5a9d-499e-bfca-f8a68f6d3bf6',
    '4c9d11ec-5d49-4a8e-be31-a40955074b7b',
    '6fcf2fe2-8cb8-4693-9ee8-45e09f9d2b30',
    '79ddf1f3-65ce-4464-be83-775a8f6a0e5f',
    '80ef9ba0-61ef-4e65-9f3c-506bfda7e74e',
    '8329b21b-44f2-4229-b4b0-4b7311513526',
    '85afde7d-a685-4a5f-ad2f-c3fc516b2e42',
    '8884c12a-96f7-4f64-843d-d3ecde8eeb4f',
    '89383330-f76c-4ca4-b13b-9b3e9bf8a808',
    '9420a07a-df83-419e-a46e-ed308103e829',
    '9d784e89-4d4f-465c-a933-1d03f3a112cb',
    'a7b783bd-73d8-4b21-bc41-9a00ba015f3d',
    'a9bdf0ed-05e4-407e-b2bb-8a29d4c36ac8',
    'ad9822d2-5763-41d9-adaf-baf9da3fd490',
    'b5f11f30-0b42-4b20-b228-40b611fa463e',
    'c049fa98-d91b-43d5-84d6-f57af0b5de6c',
    'c3f9625a-9c01-408d-b6c4-57117d62ee35',
    'd1d89ac3-9652-450a-ad6c-2eed76a894d4',
    'd54bee30-49a5-424f-aebe-7719500a5698',
    'e426dbb7-cf95-42cb-aca8-9f4d3194b256',
    'ea0a9be4-d94a-41db-82bf-044d8915d6cf',
    'f163fd54-0f08-4cc1-a5aa-308f27132cc6',
    'f3da2507-4ff5-41d0-b6d7-e796df01de25',
    'f3dc2b15-7c71-4ddb-94f1-3f2c86f9751f',
    'fce38366-577c-42a2-9886-312d38e2bd56',
    
];

// Function to fetch video details
const fetchVideoDetails = async (id) => {
  try {
    const response = await axios.get(`https://apis.ccbp.in/videos/${id}`, {
      headers: {
       Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch details for video ID: ${id}`, error.message);
    return null;
  }
};

// Main function to loop through IDs and save results
const main = async () => {
  const videoDetails = [];

  for (const id of videoIds) {
    console.log(`Fetching details for video ID: ${id}`);
    const data = await fetchVideoDetails(id);
    if (data) {
      videoDetails.push(data);
    }
  }

  // Save to a JSON file
  fs.writeFileSync('videoDetails.json', JSON.stringify(videoDetails, null, 2));
  console.log('Video details saved to videoDetails.json');
};

main();
