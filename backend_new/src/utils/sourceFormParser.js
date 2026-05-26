// import fs from "fs/promises";
// import path from "path";
// import zlib from "zlib";
// import { fileURLToPath } from "url";

// /*
//   Supporting utility:
//   This utility converts official ISO Word/Excel source forms into a web-friendly
//   JSON shape when needed. The dashboard itself should be powered by core backend
//   services and database records, not by parsing files at display time.
// */

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const ISO_FORMS_DIR = path.resolve(__dirname, "../../../frontend_new/public/ISO_FORMS");

// const parsedSourceCache = new Map();

// const EOCD_SIGNATURE = 0x06054b50;
// const CENTRAL_DIR_SIGNATURE = 0x02014b50;
// const LOCAL_FILE_SIGNATURE = 0x04034b50;

// const xmlEntityMap = {
//   "&amp;": "&",
//   "&lt;": "<",
//   "&gt;": ">",
//   "&quot;": '"',
//   "&apos;": "'",
// };

// const cleanText = (value = "") =>
//   value
//     .replace(/<[^>]+>/g, " ")
//     .replace(/&(?:amp|lt|gt|quot|apos);/g, (entity) => xmlEntityMap[entity] || entity)
//     .replace(/\s+/g, " ")
//     .trim();

// const sanitizeKey = (value = "", fallback = "field") => {
//   const sanitized = value
//     .toLowerCase()
//     .replace(/&/g, " and ")
//     .replace(/[^a-z0-9]+/g, " ")
//     .trim()
//     .split(/\s+/)
//     .slice(0, 6)
//     .join("_");
//   return sanitized || fallback;
// };

// const looksLikeLabel = (value = "") => {
//   if (!value) return false;
//   const text = cleanText(value);
//   if (!text || text.length < 2) return false;
//   if (/^ff\s*no/i.test(text)) return false;
//   if (/^[0-9./-]+$/.test(text)) return false;
//   return /[a-z]/i.test(text);
// };

// const inferFieldType = (label = "") => {
//   const lower = label.toLowerCase();
//   if (/(date|from|to|deadline)/.test(lower)) return "date";
//   if (/month/.test(lower)) return "month";
//   if (/(semester|sem)\b/.test(lower)) return "select";
//   if (/(count|qty|quantity|marks|score|percentage|attainment|no\.|number)/.test(lower)) return "number";
//   if (/(remark|observation|description|topic|purpose|details|feedback)/.test(lower)) return "textarea";
//   return "text";
// };

// const inferFieldOptions = (label = "") => {
//   if (inferFieldType(label) !== "select") return undefined;
//   return ["1", "2", "3", "4", "5", "6", "7", "8"];
// };

// const readUInt32LE = (buffer, offset) => buffer.readUInt32LE(offset);
// const readUInt16LE = (buffer, offset) => buffer.readUInt16LE(offset);

// const findEndOfCentralDirectory = (buffer) => {
//   for (let offset = buffer.length - 22; offset >= Math.max(0, buffer.length - 0xffff - 22); offset -= 1) {
//     if (readUInt32LE(buffer, offset) === EOCD_SIGNATURE) {
//       return offset;
//     }
//   }
//   throw new Error("Invalid ZIP: end of central directory not found.");
// };

// const getZipEntries = (buffer) => {
//   const eocdOffset = findEndOfCentralDirectory(buffer);
//   const totalEntries = readUInt16LE(buffer, eocdOffset + 10);
//   const centralDirOffset = readUInt32LE(buffer, eocdOffset + 16);
//   const entries = [];
//   let pointer = centralDirOffset;

//   for (let index = 0; index < totalEntries; index += 1) {
//     if (readUInt32LE(buffer, pointer) !== CENTRAL_DIR_SIGNATURE) {
//       throw new Error("Invalid ZIP: central directory entry not found.");
//     }

//     const compressionMethod = readUInt16LE(buffer, pointer + 10);
//     const compressedSize = readUInt32LE(buffer, pointer + 20);
//     const uncompressedSize = readUInt32LE(buffer, pointer + 24);
//     const fileNameLength = readUInt16LE(buffer, pointer + 28);
//     const extraFieldLength = readUInt16LE(buffer, pointer + 30);
//     const fileCommentLength = readUInt16LE(buffer, pointer + 32);
//     const localHeaderOffset = readUInt32LE(buffer, pointer + 42);
//     const fileName = buffer.toString("utf8", pointer + 46, pointer + 46 + fileNameLength);

//     entries.push({
//       fileName,
//       compressionMethod,
//       compressedSize,
//       uncompressedSize,
//       localHeaderOffset,
//     });

//     pointer += 46 + fileNameLength + extraFieldLength + fileCommentLength;
//   }

//   return entries;
// };

// const extractZipEntry = (buffer, targetFileName) => {
//   const entry = getZipEntries(buffer).find((item) => item.fileName === targetFileName);
//   if (!entry) return null;

//   const localHeaderOffset = entry.localHeaderOffset;
//   if (readUInt32LE(buffer, localHeaderOffset) !== LOCAL_FILE_SIGNATURE) {
//     throw new Error(`Invalid ZIP: local header missing for ${targetFileName}.`);
//   }

//   const fileNameLength = readUInt16LE(buffer, localHeaderOffset + 26);
//   const extraFieldLength = readUInt16LE(buffer, localHeaderOffset + 28);
//   const dataOffset = localHeaderOffset + 30 + fileNameLength + extraFieldLength;
//   const compressedData = buffer.subarray(dataOffset, dataOffset + entry.compressedSize);

//   if (entry.compressionMethod === 0) return Buffer.from(compressedData);
//   if (entry.compressionMethod === 8) return zlib.inflateRawSync(compressedData);

//   throw new Error(`Unsupported ZIP compression method ${entry.compressionMethod} for ${targetFileName}.`);
// };

// const extractParagraphs = (xml) => {
//   const matches = xml.match(/<w:p[\s\S]*?<\/w:p>/g) || [];
//   return matches.map((paragraph) => cleanText((paragraph.match(/<w:t[^>]*>[\s\S]*?<\/w:t>/g) || []).join(" "))).filter(Boolean);
// };

// const extractDocxTables = (xml) => {
//   const tables = xml.match(/<w:tbl[\s\S]*?<\/w:tbl>/g) || [];
//   return tables.map((table, tableIndex) => {
//     const rows = (table.match(/<w:tr[\s\S]*?<\/w:tr>/g) || []).map((row) =>
//       (row.match(/<w:tc[\s\S]*?<\/w:tc>/g) || []).map((cell) =>
//         cleanText((cell.match(/<w:t[^>]*>[\s\S]*?<\/w:t>/g) || []).join(" "))
//       )
//     );

//     return {
//       id: `table_${tableIndex + 1}`,
//       rows: rows.filter((row) => row.some(Boolean)),
//     };
//   }).filter((table) => table.rows.length);
// };

// const extractSharedStrings = (xml = "") =>
//   (xml.match(/<si[\s\S]*?<\/si>/g) || []).map((entry) =>
//     cleanText((entry.match(/<t[^>]*>[\s\S]*?<\/t>/g) || []).join(" "))
//   );

// const extractWorksheetRows = (xml = "", sharedStrings = []) => {
//   const rows = xml.match(/<row[\s\S]*?<\/row>/g) || [];
//   return rows
//     .map((row) => {
//       const cells = row.match(/<c[\s\S]*?<\/c>/g) || [];
//       return cells
//         .map((cell) => {
//           const valueMatch = cell.match(/<v>([\s\S]*?)<\/v>/);
//           if (!valueMatch) return "";
//           const typeMatch = cell.match(/\bt="([^"]+)"/);
//           const cellType = typeMatch?.[1];
//           const rawValue = valueMatch[1];
//           if (cellType === "s") return sharedStrings[Number(rawValue)] || "";
//           return cleanText(rawValue);
//         })
//         .map((value) => cleanText(value))
//         .filter(Boolean);
//     })
//     .filter((row) => row.length);
// };

// const getUniqueFields = (fields) => {
//   const seen = new Set();
//   return fields.filter((field) => {
//     if (!field?.name || seen.has(field.name)) return false;
//     seen.add(field.name);
//     return true;
//   });
// };

// const buildFieldFromLabel = (label, index = 0) => {
//   const type = inferFieldType(label);
//   return {
//     name: sanitizeKey(label, `field_${index + 1}`),
//     label,
//     type,
//     required: true,
//     ...(type === "select" ? { options: inferFieldOptions(label) } : {}),
//   };
// };

// const buildFieldSection = (fields, title = "Details") => ({
//   id: `${sanitizeKey(title)}_section`,
//   type: "fields",
//   title,
//   fields: getUniqueFields(fields),
// });

// const buildTableSection = (headers, fallbackTitle, sectionIndex) => {
//   const columns = headers.map((header, index) => ({
//     name: sanitizeKey(header, `column_${index + 1}`),
//     label: header || `Column ${index + 1}`,
//     type: inferFieldType(header),
//     required: false,
//     ...(inferFieldType(header) === "select" ? { options: inferFieldOptions(header) } : {}),
//   }));

//   return {
//     id: `table_section_${sectionIndex + 1}`,
//     type: "table",
//     title: fallbackTitle,
//     name: `tableSection${sectionIndex + 1}`,
//     columns,
//     minRows: 1,
//   };
// };

// const deriveSectionsFromRows = (rows = [], title = "Source Table", sectionIndex = 0) => {
//   if (!rows.length) return [];

//   const pairFields = [];
//   rows.slice(0, 8).forEach((row) => {
//     if (row.length === 2 && looksLikeLabel(row[0])) {
//       pairFields.push(buildFieldFromLabel(row[0], pairFields.length));
//       return;
//     }

//     if (row.length % 2 === 0 && row.length <= 8) {
//       for (let index = 0; index < row.length; index += 2) {
//         const label = row[index];
//         if (looksLikeLabel(label)) {
//           pairFields.push(buildFieldFromLabel(label, pairFields.length));
//         }
//       }
//     }
//   });

//   const sections = [];
//   if (pairFields.length >= 2) {
//     sections.push(buildFieldSection(pairFields, `${title} Details`));
//   }

//   const headerRow = rows.find((row) => row.length >= 3 && row.filter(Boolean).length >= 3);
//   if (headerRow) {
//     sections.push(buildTableSection(headerRow, title, sectionIndex));
//   }

//   return sections;
// };

// const deriveSectionsFromParagraphs = (paragraphs = []) => {
//   const candidateLabels = paragraphs
//     .map((line) => line.replace(/:$/, "").trim())
//     .filter((line) => looksLikeLabel(line) && line.length <= 50)
//     .filter((line) => !/^title$/i.test(line))
//     .slice(0, 8)
//     .map((label, index) => buildFieldFromLabel(label, index));

//   return candidateLabels.length >= 2 ? [buildFieldSection(candidateLabels, "Captured Information")] : [];
// };

// const buildPreview = (sourceType, headings = [], tables = []) => ({
//   sourceType,
//   headings: headings.slice(0, 4),
//   tables: tables.slice(0, 3).map((table) => ({
//     id: table.id,
//     rows: table.rows.slice(0, 6),
//   })),
// });

// const defaultFieldsToSections = (fields = []) => {
//   if (!fields.length) return [];
//   return [
//     {
//       id: "default_fields",
//       type: "fields",
//       title: "Form Inputs",
//       fields,
//     },
//   ];
// };

// const ensureBaseSection = (sections = [], templateTitle = "") => {
//   const flattenedNames = new Set(
//     sections.flatMap((section) =>
//       section.type === "fields" ? section.fields.map((field) => field.name) : []
//     )
//   );

//   const baseFields = [];
//   if (!flattenedNames.has("academic_year")) {
//     baseFields.push({ name: "academic_year", label: "Academic Year", type: "text", required: true, placeholder: "e.g., 2024-25" });
//   }
//   if (!flattenedNames.has("semester") && !/alumni|budget/i.test(templateTitle)) {
//     baseFields.push({
//       name: "semester",
//       label: "Semester",
//       type: "select",
//       required: true,
//       options: ["1", "2", "3", "4", "5", "6", "7", "8"],
//     });
//   }

//   return baseFields.length ? [buildFieldSection(baseFields, "General Information"), ...sections] : sections;
// };

// const parseDocxForm = (buffer, template) => {
//   const documentXml = extractZipEntry(buffer, "word/document.xml")?.toString("utf8");
//   if (!documentXml) return null;

//   const paragraphs = extractParagraphs(documentXml);
//   const tables = extractDocxTables(documentXml);
//   const sections = tables.flatMap((table, index) =>
//     deriveSectionsFromRows(table.rows, `Section ${index + 1}`, index)
//   );

//   const paragraphSections = deriveSectionsFromParagraphs(paragraphs);
//   const combinedSections = ensureBaseSection(
//     sections.length ? sections : paragraphSections.length ? paragraphSections : defaultFieldsToSections(template.fields),
//     template.title
//   );

//   return {
//     preview: buildPreview("docx", paragraphs, tables),
//     sections: combinedSections.length ? combinedSections : defaultFieldsToSections(template.fields),
//   };
// };

// const parseXlsxForm = (buffer, template) => {
//   const sharedStringsXml = extractZipEntry(buffer, "xl/sharedStrings.xml")?.toString("utf8") || "";
//   const sharedStrings = extractSharedStrings(sharedStringsXml);
//   const entries = getZipEntries(buffer).filter((entry) => /^xl\/worksheets\/sheet\d+\.xml$/.test(entry.fileName));

//   const sheets = entries.map((entry, index) => {
//     const xml = extractZipEntry(buffer, entry.fileName)?.toString("utf8") || "";
//     const rows = extractWorksheetRows(xml, sharedStrings);
//     return {
//       id: `sheet_${index + 1}`,
//       title: `Worksheet ${index + 1}`,
//       rows,
//     };
//   }).filter((sheet) => sheet.rows.length);

//   const sections = sheets.flatMap((sheet, index) =>
//     deriveSectionsFromRows(sheet.rows, sheet.title, index)
//   );

//   return {
//     preview: buildPreview("xlsx", [template.title], sheets),
//     sections: ensureBaseSection(
//       sections.length ? sections : defaultFieldsToSections(template.fields),
//       template.title
//     ),
//   };
// };

// export const getParsedSourceForm = async (sourceFile, template) => {
//   if (!sourceFile) {
//     return {
//       preview: { sourceType: "manual", headings: [template.title], tables: [] },
//       sections: ensureBaseSection(defaultFieldsToSections(template.fields), template.title),
//     };
//   }

//   if (parsedSourceCache.has(sourceFile)) {
//     const cached = parsedSourceCache.get(sourceFile);
//     return {
//       preview: cached.preview,
//       sections: cached.sections.length ? cached.sections : ensureBaseSection(defaultFieldsToSections(template.fields), template.title),
//     };
//   }

//   const filePath = path.join(ISO_FORMS_DIR, sourceFile);
//   const buffer = await fs.readFile(filePath);
//   const extension = path.extname(sourceFile).toLowerCase();

//   let parsed = null;
//   if (extension === ".docx") parsed = parseDocxForm(buffer, template);
//   if (extension === ".xlsx") parsed = parseXlsxForm(buffer, template);

//   if (!parsed) {
//     parsed = {
//       preview: { sourceType: extension.replace(".", "") || "file", headings: [template.title], tables: [] },
//       sections: ensureBaseSection(defaultFieldsToSections(template.fields), template.title),
//     };
//   }

//   parsedSourceCache.set(sourceFile, parsed);
//   return parsed;
// };
