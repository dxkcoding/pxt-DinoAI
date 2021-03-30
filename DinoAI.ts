//% color="#5c7cfa" weight=10 icon="\u07DC"
//% groups='["Basic", "Graphic"]'
namespace DinoAI{
    type Evttxt = (txt: string) => void
    let qrcodeEvt: Evttxt = null

    export enum LcdInvert {
        //% block=True
        True = 1,
        //% block=False
        False  = 0,
    }

    function trim(n: string): string {
        while (n.charCodeAt(n.length - 1) < 0x1f) {
        n = n.slice(0, n.length - 1)
        }
        return n
    }

    serial.onDataReceived('\n', function () {
        let a = serial.readUntil('\n')
        if (a.charAt(0) == 'K') {
        a = trim(a)
        let b = a.slice(1, a.length).split(' ')
        let cmd = parseInt(b[0])
            if (cmd == 20){// qrcode return
                if (qrcodeEvt) {
                    qrcodeEvt(b[1])
                }
            }
        }
    })


    function asyncWrite(msg: string, evt: number): void {
        serial.writeLine(msg)
        control.waitForEvent(EventBusSource.MES_BROADCAST_GENERAL_ID, 0x8900 + evt)
    }
    
    /**
     * init serial port
     * Tx pin: SerialPin.P0
     * Rx pin: SerialPin.P1
     **/
    //% blockId=dinoai_init block="DinoAI init"
    //% group="Basic" weight=100
    export function dinoai_init(): void {
        serial.redirect(SerialPin.P0, SerialPin.P1, BaudRate.BaudRate115200)
        basic.pause(100)
        serial.setTxBufferSize(64)
        serial.setRxBufferSize(64)
        serial.readString()
        // serial.writeString('\n\n')
        // take control of the ext serial port from k210
        asyncWrite(`K0`, 0)
        basic.pause(300)
    }

    /**
     * @param name jpeg to display; eg: name.jpg
     */
    //% blockId=DinoAI_display block="DinoAI Display %name"
    //% group="Basic" weight=99 blockGap=40
    export function DinoAI_display(name: string): void {
        let str = `K1 ${name}`
        serial.writeLine(str)
    }

    /**
     * @param name savepath; eg: name.jpg
     */
    //% blockId=DinoAI_screenshot block="DinoAI Screenshot %name"
    //% group="Basic" weight=98
    export function DinoAI_screenshot(name: string): void {
        let str = `K2 ${name}`
        serial.writeLine(str)
    }

    //% blockId=DinoAI_clear block="DinoAI clear"
    //% group="Basic" weight=97
    export function DinoAI_clear(): void {
        let str = `K3`
        serial.writeLine(str)
    }

    /**
     * @param t string to display; eg: hello
     * @param d delay; eg: 1000
     */
    //% blockId=DinoAI_print block="DinoAI print %t X %x Y %y"
    //% x.min=0 x.max=240
    //% y.min=0 y.max=240
    //% group="Basic" weight=96
    export function DinoAI_print(t: string, x: number,y: number): void {
        let str = `K4 ${x} ${y} ${t}`
        serial.writeLine(str)
    }

    /**
     * @param dir 
     */
    //% blockId=DinoAI_lcd_rotation block="DinoAI lcd rotation %dir"
    //% dir.min=0 dir.max=3
    //% group="Basic" weight=95
    export function DinoAI_lcd_rotation(dir: number): void {
        let str = `K5 ${dir}` 
        serial.writeLine(str)
    }

    /**
     * @param invert LcdInvert
     */
    //% blockId=DinoAI_lcd_mirror block="DinoAI lcd micrror %invert"
    //% group="Basic" weight=95
    export function DinoAI_lcd_mirror(invert: LcdInvert): void {
        let str = `K6 ${invert}` 
        serial.writeLine(str)
    }

    //% blockId=dinoai_qrcode block="DinoAI QR code"
    //% group="Graphic" weight=94
    export function koi_qrcode() {
        let str = `K20`
        serial.writeLine(str)
    }

    //% blockId=dinoai_onqrcode block="on QR code"
    //% group="Graphic" weight=93 draggableParameters=reporter blockGap=40
    export function koi_onqrcode(handler: (link: string) => void) {
        qrcodeEvt = handler
    }

    /**
     * @param key color key; eg: red
     */
    //% blockId=koi_colorcali block="KOI color calibration %key"
    //% group="Graphic" weight=76
    export function koi_colorcali(key: string) {
        let str = `K16 ${key}`
        serial.writeLine(str)
    }

    
}