//% color="#5c7cfa" weight=10 icon="\u07DC"
//% groups='["Basic", "Graphic", "Model", "Classifier"]'
namespace DinoAI{
    type Evttxt = (txt: string) => void
    type Evtxywh = (x: number, y: number, w: number, h: number) => void
    type Evtxyr = (x: number, y: number, r: number) => void
    type Evtd = (d: number) => void
    type Evtxy = (x: number, y: number) => void
    let qrcodeEvt: Evttxt = null
    let colorblobEvt: Evtxywh = null
    let circleEvt: Evtxyr = null
    let rectEvt: Evtxywh = null
    let maskEvt: Evtd = null
    let faceEvt: Evtxy = null
    let mnistEvt: Evtd = null
    let classifierOutputEvt: Evttxt = null

    export enum LcdInvert {
        //% block=True
        True = 1,
        //% block=False
        False  = 0
    }

    export enum ColorChoice {
        //% block=Red
        Red = 0,
        //% block=Green
        Green  = 1,
        //% block=Blue
        Blue  = 2,
        //% block=Yellow
        Yellow = 3
    }

    export enum ModelChoice {
        //% block=Mask_detect
        Mask_detect = 0,
        //% block=Face_detect
        Face_detect  = 1,
        //% block=MNIST
        MNIST  = 2,
        //% block=Classifier
        Classifier = 3
    }

    function trim(n: string): string {
        while (n.charCodeAt(n.length - 1) < 0x1f) {
        n = n.slice(0, n.length - 1)
        }
        return n
    }

    serial.onDataReceived('\n', function () {
        let a = serial.readUntil('\n')
        if (a.charAt(1) == 'K') {
            a = trim(a)
        let b = a.slice(2, a.length).split(' ')
        let cmd = parseInt(b[0])
            if (cmd == 20){// qrcode return
                if (qrcodeEvt) {
                    qrcodeEvt(a.slice(5, -1))
                }
            }else 
            if (cmd == 21){// colorblob return
                if (colorblobEvt){
                    colorblobEvt(parseInt(b[1]), parseInt(b[2]),
                                parseInt(b[3]), parseInt(b[4]))
                }
            }else
            if (cmd == 22){
                if (circleEvt){// circle_track return
                    circleEvt(parseInt(b[1]), parseInt(b[2]),
                                parseInt(b[3]))
                }
            }else 
            if (cmd == 23){// rectangle_track return
                if (rectEvt){
                    rectEvt(parseInt(b[1]), parseInt(b[2]),
                                parseInt(b[3]), parseInt(b[4]))
                }
            }else 
            if (cmd == 41){//  mask detect return
                if (maskEvt){
                    maskEvt(parseInt(b[1]))
                }
            }else 
            if (cmd == 42){// face detect return
                if (faceEvt){
                    faceEvt(parseInt(b[1]), parseInt(b[2]))
                }
            }else 
            if (cmd == 43){// handwritten digits recognize return
                if (mnistEvt){
                    mnistEvt(parseInt(b[1]))
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
    export function DinoAI_init(): void {
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

    //% blockId=DinoAI_qrcode block="DinoAI QR code"
    //% group="Graphic" weight=79
    export function DinoAI_qrcode() {
        let str = `K20`
        serial.writeLine(str)
    }

    //% blockId=DinoAI_onqrcode block="on QR code"
    //% group="Graphic" weight=78 draggableParameters=reporter blockGap=40
    export function DinoAI_onqrcode(handler: (link: string) => void) {
        qrcodeEvt = handler
    }


    /**
     * @param c ColorChoice
     */
    //% blockId=DinoAI_track_colorblob block="DinoAI track color blob %c"
    //% group="Graphic" weight=77
    export function DinoAI_track_colorblob(c: ColorChoice): void {
        let str = `K21 ${c}`
        serial.writeLine(str)
    }

    //% blockId=DinoAI_oncolorblob block="on Color blob"
    //% group="Graphic" weight=76 draggableParameters=reporter blockGap=40
    export function DinoAI_oncolorblob(
        handler: (x: number, y: number, w: number, h: number) => void
    ) {
        colorblobEvt = handler
    }

    /**
     * @param th threshold; eg: 2000
     */
    //% blockId=DinoAI_track_circle block="DinoAI track circle threshold%th"
    //% group="Graphic" weight=75
    export function DinoAI_track_circle(th: number): void {
        let str = `K22 ${th}`
        serial.writeLine(str)

    }

    //% blockId=DinoAI_oncircletrack block="on Find Circle"
    //% group="Graphic" weight=74 draggableParameters=reporter blockGap=40
    export function DinoAI_oncircletrack(
        handler: (x: number, y: number, r: number) => void
    ) {
        circleEvt = handler
    }

    /**
     * @param th threshold; eg: 6000
     */
    //% blockId=DinoAI_track_rect block="DinoAI track rectangle %th"
    //% group="Graphic" weight=73
    export function DinoAI_track_rect(th: number): void {
        let str = `K23 ${th}`
        serial.writeLine(str)
    }

    //% blockId=DinoAI_onrecttrack block="on Find Rectangle"
    //% group="Graphic" weight=72 draggableParameters=reporter blockGap=40
    export function DinoAI_onrecttrack(
        handler: (x: number, y: number, w: number, h: number) => void
    ) {
        rectEvt = handler
    }

    /**
     * @param addr ModelChoice: model address
     */
    //% blockId=DinoAI_load_model block="DinoAI load model %addr"
    //% group="Model" weight=60
    export function DinoAI_load_model(addr: ModelChoice): void {
        let str = `K40 ${addr}`
        serial.writeLine(str)
    }

    //% blockId=DinoAI_mask_detect block="DinoAI mask detect"
    //% group="Model" weight=59
    export function DinoAI_mask_detect(): void {
        let str = `K41`
        serial.writeLine(str)
    }
    
    //% blockId=DinoAI_onmaskdetect block="on detect mask [-1:without; 0:null; 1:with]"
    //% group="Model" weight=58 draggableParameters=reporter blockGap=40
    export function DinoAI_onmaskdetect(
        handler: (m: number) => void
    ) {
        maskEvt = handler
    }

    //% blockId=DinoAI_face_detect block="DinoAI face detect"
    //% group="Model" weight=57
    export function DinoAI_face_detect(): void {
        let str = `K42`
        serial.writeLine(str)
    }
    
    //% blockId=DinoAI_onfacedetect block="on detect face"
    //% group="Model" weight=56 draggableParameters=reporter blockGap=40
    export function DinoAI_onfacedetect(
        handler: (x: number, y: number) => void
    ) {
        faceEvt = handler
    }

    //% blockId=DinoAI_handwritten_digits_recognize block="DinoAI handwritten digits recognize"
    //% group="Model" weight=55
    export function DinoAI_handwritten_digits_recognize(): void {
        let str = `K43`
        serial.writeLine(str)
    }
    
    //% blockId=DinoAI_ondigitsrec block="on recognize handwritten digits"
    //% group="Model" weight=54 draggableParameters=reporter blockGap=40
    export function DinoAI_ondigitsrec(
        handler: (d: number) => void
    ) {
        mnistEvt = handler
    }

    /**
     * @param n number: set number
     */
    //% blockId=DinoAI_classifier_config_setnumber block="DinoAI config Classifier: set number %n"
    //% group="Classifier" weight=40
    //% n.min=1 n.max=5
    export function DinoAI_classifier_config_setnumber(n:number): void {
        let str = `K80 ${n}`
        serial.writeLine(str)
    }

    /**
     * @param n number: sample number
     */
    //% blockId=DinoAI_classifier_config_samplenumber block="DinoAI config Classifier: sample number %n and add tag %t"
    //% group="Classifier" weight=39
    //% n.min=3 n.max=5
    export function DinoAI_classifier_config_samplenumber(n:number, t:string[]): void {
        let str = `K81 ${n} ${t}`
        serial.writeLine(str)  
        
    }

    /**
     * @param t list: tag list
     */
    //% blockId=DinoAI_classifier_config_addtag block="DinoAI config Classifier: add tag %t"
    //% group="Classifier" weight=38
    /*export function DinoAI_classifier_config_addtag(t:string[]): void {
        let str = `K82 ${t}`
        serial.writeLine(str)
    }*/

    //% blockId=DinoAI_classifier_snapshot block="DinoAI Classifier snapshot"
    //% group="Classifier" weight=36
    export function DinoAI_classifier_snapshot(): void {
        let str = `K83`
        serial.writeLine(str)
    }

    //% blockId=DinoAI_classifier_train block="DinoAI Classifier train"
    //% group="Classifier" weight=35
    export function DinoAI_classifier_train(): void {
        let str = `K84`
        serial.writeLine(str)
    }

    //% blockId=DinoAI_classifier_predict block="DinoAI Classifier predict"
    //% group="Classifier" weight=34
    export function DinoAI_classifier_predict(): void {
        let str = `K85`
        serial.writeLine(str)
    }

    //% blockId=DinoAI_classifier_predict block="DinoAI Classifier output"
    //% group="Classifier" weight=33
    export function DinoAI_classifier_output(
        handler: (output: string) => void
    ) {
        classifierOutputEvt = handler
    }

    /**
     * @param s string: model savepath
     */
    //% blockId=DinoAI_classifier_save_model block="DinoAI Classifier save model in %s"
    //% group="Classifier" weight=32
    export function DinoAI_classifier_save_model(s:string): void {
        let str = `K86 ${s}`
        serial.writeLine(str)
    }

    /**
     * @param s string: model savepath
     */
    //% blockId=DinoAI_classifier_load_model block="DinoAI Classifier load model from %s"
    //% group="Classifier" weight=31
    export function DinoAI_classifier_load_model(s:string): void {
        let str = `K87 ${s}`
        serial.writeLine(str)
    }
}