//% color="#5c7cfa" weight=10 icon="\u07DC"
//% groups='["Basic", "Graphic"]'
namespace DinoAI{


    export enum LcdInvert {
        //% block=True
        True = 1,
        //% block=False
        False  = 0,
    }

    function asyncWrite(msg: string, evt: number): void {
        serial.writeLine(msg)
        control.waitForEvent(EventBusSource.MES_BROADCAST_GENERAL_ID, 0x8900 + evt)
    }
    
    /**
     * init serial port
     * Tx pin: SerialPin.P0
     * Rx pin: SerialPin.P1
     **/
    //% blockId=ai_init block="DinoAI init"
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

    /**
     * @param (R,G,B): RGB8888 color
     */
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
    //% blockId=DinoAI_print block="DinoAI print %t X %x Y %y||delay %d ms"
    //% x.min=0 x.max=240
    //% y.min=0 y.max=240
    //% group="Basic" weight=96
    export function DinoAI_print(t: string, x: number,y: number, d:number=1000): void {
        let str = `K4 ${x} ${y} ${d} ${t}`
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

    
}