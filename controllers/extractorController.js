const extractorModel = require('../models/extractorModel');
const gpmfExtract = require('gpmf-extract')
const goproTelemetry = require('gopro-telemetry')
const fs = require('fs')

const extractorController = {

  getTelemetryByFilter: async (req, res) => {
    const { videoPath, sensor, timeIn, groupTimes } = req.body

      function isMP4File(filePath) {
        const fileExtension = filePath.split('.').pop();
        if (fileExtension === 'MP4' || fileExtension === 'mp4') {
          return true;
        } else {
          return false;
        }
      }

    if (fs.existsSync(videoPath)) {
      if (isMP4File(videoPath)) {

        // Real Code

        const readStream = fs.createReadStream(videoPath)
        const options = {
            stream: [sensor],
            timeIn: timeIn,
            groupTimes: groupTimes,
          };
        let chunks = []
        let fileLength = 0
        let bytesRead = 0

        readStream.on('error', (error) => console.log(error.message))
        readStream.on('data', chunk => {
          chunks.push(chunk)
          bytesRead += chunk.length
          console.log(`${bytesRead} bytes read`)
          const percentage = Math.round((bytesRead / fileLength) * 100)
          console.log(`Progress: ${percentage} %`)
        });
        readStream.on('end', () => {
          const buffer = Buffer.concat(chunks)
          console.log(`Finished reading file with length ${buffer.length}`)

          gpmfExtract(buffer).then(extracted => {
            console.log('-------------------------')
            console.log('Process: gpmfExtract')
            console.log('Status : Extracted success')
            goproTelemetry(extracted, options, telemetry => {
              console.log('-------------------------')
              console.log('Process: goproTelemetry')
              console.log('Status : Extracted success')
              if (telemetry != null) {
                console.log('-------------------------')
                console.log('telemetry not null...')
                fs.writeFileSync('accl.json', JSON.stringify(telemetry))
                const file = `${Date.now()}-telemetry.json`
                console.log(file);
                res.download('accl.json', file, () => {
                  fs.unlinkSync('accl.json')
                })
              } else {
                res.json(message.error)
              }
            }).catch(error => console.error(error))
          }).catch(error => console.error(error))
        })

        fs.stat(videoPath, (err, stats) => {
          if (err) throw err;
          fileLength = stats.size
        })
        // End Real Code
      } else {
        res.json('The file is not a MP4 video file');
      }
    } else {
      res.json('Path does not exist!');
    }
  }

};

module.exports = extractorController;

