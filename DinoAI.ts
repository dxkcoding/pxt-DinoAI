//% color="#5c7cfa" weight=10 icon="\u07DC"
//% groups='["Basic", "Graphic"]'
namespace DinoAI{




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
        serial.writeString('\n\n')
        // take control of the ext serial port from k210
        asyncWrite(`K0`, 0)
        basic.pause(300)
    }

    /**
     * @param name jpeg to display; eg: name.jpg
     */
    //% blockId=DinoAI_display block="DinoAI Display %name"
    //% group="Basic" weight=94 blockGap=40
    export function DinoAI_display(name: string): void {
        let str = `K1 ${name}`
        serial.writeLine(str)
    }

    /**
     * @param name savepath; eg: name.jpg
     */
    //% blockId=DinoAI_screenshot block="DinoAI Screenshot %name"
    //% group="Basic" weight=95
    export function DinoAI_screenshot(name: string): void {
        let str = `K2 ${name}`
        serial.writeLine(str)
    }

    /**
     * @param (R,G,B): RGB8888 color
     */
    //% blockId=DinoAI_clear_setcolor block="DinoAI clear || and set color %R %G %B"
    //% group="Basic" weight=95
    export function DinoAI_clear_setcolor(R: number=0, G: number=0, B: number=0): void {
        let str = `K3 ${R} ${G} ${B}`
        serial.writeLine(str)
    }

    /**
     * @param t string to display; eg: hello
     * @param d delay; eg: 1000
     */
    //% blockId=DinoAI_print block="DinoAI print %t X %x Y %y||delay %d ms"
    //% x.min=0 x.max=240
    //% y.min=0 y.max=240
    //% group="Basic" weight=97
    export function DinoAI_print(t: string, x: number,y: number, d:number=1000): void {
        let str = `K4 ${x} ${y} ${d} ${t}`
        serial.writeLine(str)
    }



    
}