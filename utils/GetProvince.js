export async function GetProvince() {
	var listProvince = (await (await fetch('https://vapi.vnappmob.com/api/province/')).json()).results;
	const regex1 = /^(Tỉnh)/;
	const regex2 = /^(Thành)/;
	listProvince = listProvince.map((e) => {
		const parts = e.province_name.split(' ');
		if (e.province_name.match(regex1)) {
			e.province_name = parts.slice(1).join(' ');
		} else if (e.province_name.match(regex2)) {
			e.province_name = parts.slice(2).join(' ');
		}
		return e.province_name;
	});
	return listProvince;
}
