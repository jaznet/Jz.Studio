
export class FormatUtils {

  NumericString(item: number): string {
    let formatString: string = item.toFixed(2);
    formatString = this.addCommas(formatString);
    return formatString;
  }

  addCommas(nStr: string) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  }
}
