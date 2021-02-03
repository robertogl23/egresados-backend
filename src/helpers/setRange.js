const getRange = ({p}) =>{ 
    switch (parseInt(p)) {
        case 0:
            return 'Data!A2:A';
        case 1:
            return 'Data!B2:B';
        case 2:
            return 'Data!C2:C';
        case 3:
            return 'Data!D2:D';
        case 4:
            return 'Data!E2:E';
        case 5:
            return 'Data!F2:F';
        case 6:
            return 'Data!G2:G';
        case 7:
            return 'Data!H2:H';
        case 8:
            return 'Data!I2:I';
        case 9:
            return 'Data!J2:J';
        case 10:
            return 'Data!K2:K';
        case 11:
            return 'Data!L2:L';
        case 12:
            return 'Data!M2:M';
        case 13:
            return 'Data!N2:N';
        case 14:
            return 'Data!O2:O';
        case 15:
            return 'Data!P2:P';
        case 16:
            return 'Data!Q2:Q';
    
        default:
            return 'Data!R2:R';
    }
}
module.exports = getRange