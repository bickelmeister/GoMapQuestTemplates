import { Command, Flags } from '@oclif/core';
import * as fs from 'fs';
import * as path from 'path';

const BASE_QUESTS_DIR = 'quests';

export default class Create extends Command {
  static override description = 'Generates a JSON file with quests. This file can be imported by Go Map!!'

  static override examples = [
    '<%= config.bin %> <%= command.id %> -q service:bicycle:pump -q access -o ./output',
    '<%= config.bin %> <%= command.id %> -d bicycle_parking -o ./output',
    '<%= config.bin %> <%= command.id %> --all -o ./output',
  ]

  static override flags = {
    quests: Flags.string({ char: 'q', description: 'name of the quest file you want to create a json output for', multiple: true }),
    directory: Flags.string({ char: 'd', description: 'the directory you want to create the json output for' }),
    output: Flags.string({ char: 'o', description: 'output directory', default: './output' }),
    all: Flags.boolean({ char: 'a', description: 'include all JSON files from the root quests directory and its subdirectories' })
  }

  async findQuestFiles(baseDir: string, filename: string): Promise<string[]> {
    const files = fs.readdirSync(baseDir);
    const matchedFiles: string[] = [];
    for (const file of files) {
      const fullPath = path.join(baseDir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        const results = await this.findQuestFiles(fullPath, filename);
        matchedFiles.push(...results);
      } else if (file === `${filename}.json`) {
        matchedFiles.push(fullPath);
      }
    }
    return matchedFiles;
  }

  async findDirectory(baseDir: string, dirName: string): Promise<string | null> {
    const files = fs.readdirSync(baseDir);
    for (const file of files) {
      const fullPath = path.join(baseDir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        if (file === dirName) {
          return fullPath;
        } else {
          const result = await this.findDirectory(fullPath, dirName);
          if (result) {
            return result;
          }
        }
      }
    }
    return null;
  }

  async findAllQuestFiles(baseDir: string): Promise<string[]> {
    const files = fs.readdirSync(baseDir);
    const allFiles: string[] = [];
    for (const file of files) {
      const fullPath = path.join(baseDir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        const results = await this.findAllQuestFiles(fullPath);
        allFiles.push(...results);
      } else if (file.endsWith('.json')) {
        allFiles.push(fullPath);
      }
    }
    return allFiles;
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(Create);
    const { quests, directory, output, all } = flags;

    // Check that either quests, directory, or all is provided
    if (!quests && !directory && !all) {
      this.error('Either --quests, --directory, or --all must be provided');
    }

    const outputDir = output;

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputFile = path.join(outputDir, 'quests.json');
    const filterQuestList = [];

    if (quests) {
      for (const quest of quests) {
        const questPaths = await this.findQuestFiles(BASE_QUESTS_DIR, quest);
        if (questPaths.length > 0) {
          for (const questPath of questPaths) {
            const questJson = JSON.parse(fs.readFileSync(questPath, 'utf8'));
            filterQuestList.push(questJson);
          }
        } else {
          this.error(`Quest file not found: ${quest}`);
        }
      }
    }

    if (directory) {
      const dirPath = await this.findDirectory(BASE_QUESTS_DIR, directory);
      if (dirPath) {
        const files = fs.readdirSync(dirPath);
        for (const file of files) {
          const filePath = path.join(dirPath, file);
          if (fs.statSync(filePath).isFile() && file.endsWith('.json')) {
            const questJson = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            filterQuestList.push(questJson);
          }
        }
      } else {
        this.error(`Directory not found: ${directory}`);
      }
    }

    if (all) {
      const allQuestPaths = await this.findAllQuestFiles(BASE_QUESTS_DIR);
      for (const questPath of allQuestPaths) {
        const questJson = JSON.parse(fs.readFileSync(questPath, 'utf8'));
        filterQuestList.push(questJson);
      }
    }

    const outputData = {
      featureQuestList: [],
      filterQuestList: filterQuestList,
    };

    fs.writeFileSync(outputFile, JSON.stringify(outputData, null, 2));

    this.log(`Output written to ${outputFile}`);
  }
}